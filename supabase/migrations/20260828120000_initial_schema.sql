-- Schéma initial du SaaS de facturation.
-- Tous les montants sont des entiers de FCFA (pas de décimale, jamais de float).

create extension if not exists "pgcrypto";

create type invoice_status as enum ('draft', 'sent', 'paid', 'cancelled');
create type member_role as enum ('owner', 'admin', 'member');
create type payment_method as enum (
  'cash',
  'mobile_money',
  'bank_transfer',
  'cheque',
  'card',
  'other'
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  address text,
  city text,
  country text not null default 'SN',
  phone text,
  email text,
  website text,
  logo_path text,
  ninea text,
  rccm text,
  currency text not null default 'XOF' check (currency in ('XOF', 'XAF')),
  default_vat_rate numeric(5, 2) not null default 18 check (default_vat_rate >= 0 and default_vat_rate <= 100),
  invoice_prefix text not null default 'FACT',
  next_invoice_number integer not null default 1 check (next_invoice_number > 0),
  payment_terms_days integer not null default 30 check (payment_terms_days >= 0),
  invoice_footer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid not null references organizations on delete cascade,
  full_name text,
  avatar_url text,
  role member_role not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_organization_id_idx on profiles (organization_id);

create table clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  name text not null,
  company_name text,
  email text,
  phone text,
  address text,
  city text,
  country text,
  tax_id text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_organization_id_idx on clients (organization_id);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  -- Un client porteur de factures ne peut pas être supprimé : on l'archive.
  client_id uuid not null references clients on delete restrict,
  number text not null,
  status invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date not null,
  sent_at timestamptz,
  paid_at timestamptz,
  currency text not null default 'XOF',
  vat_rate numeric(5, 2) not null default 18 check (vat_rate >= 0 and vat_rate <= 100),
  subtotal bigint not null default 0 check (subtotal >= 0),
  vat_amount bigint not null default 0 check (vat_amount >= 0),
  total bigint not null default 0 check (total >= 0),
  amount_paid bigint not null default 0 check (amount_paid >= 0),
  project_name text,
  notes text,
  terms text,
  created_by uuid references profiles on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_number_unique unique (organization_id, number),
  constraint invoices_due_after_issue check (due_date >= issue_date),
  constraint invoices_amount_paid_lte_total check (amount_paid <= total)
);

create index invoices_org_status_idx on invoices (organization_id, status);
create index invoices_org_due_date_idx on invoices (organization_id, due_date);
create index invoices_client_id_idx on invoices (client_id);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices on delete cascade,
  position integer not null default 0,
  description text not null,
  quantity numeric(12, 3) not null check (quantity > 0),
  unit_price bigint not null check (unit_price >= 0),
  vat_applicable boolean not null default true,
  line_total bigint not null check (line_total >= 0)
);

create index invoice_items_invoice_id_idx on invoice_items (invoice_id, position);

create table payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  invoice_id uuid not null references invoices on delete cascade,
  amount bigint not null check (amount > 0),
  paid_at timestamptz not null default now(),
  method payment_method not null default 'bank_transfer',
  reference text,
  notes text,
  created_at timestamptz not null default now()
);

create index payments_organization_id_idx on payments (organization_id);
create index payments_invoice_id_idx on payments (invoice_id);

-- updated_at automatique
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
  before update on organizations
  for each row execute function set_updated_at();

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();

-- Numérotation transactionnelle : le compteur est incrémenté sous verrou de ligne,
-- ce qui interdit deux factures avec le même numéro en cas de concurrence.
create or replace function next_invoice_number(org_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  prefix text;
  seq integer;
begin
  update organizations
     set next_invoice_number = next_invoice_number + 1
   where id = org_id
  returning invoice_prefix, next_invoice_number - 1 into prefix, seq;

  if prefix is null then
    raise exception 'Organisation introuvable: %', org_id;
  end if;

  return prefix || '-' || seq::text;
end;
$$;

-- Le statut « en retard » est dérivé, jamais stocké : une seule source de vérité.
create view invoices_with_status
with (security_invoker = true)
as
select
  i.*,
  case
    when i.status = 'sent' and i.due_date < current_date then 'overdue'
    else i.status::text
  end as effective_status,
  greatest(i.total - i.amount_paid, 0) as outstanding
from invoices i;

-- Une facture envoyée ou payée n'est plus modifiable (on émet un avoir à la place).
create or replace function guard_locked_invoice()
returns trigger
language plpgsql
as $$
begin
  if old.status in ('sent', 'paid') then
    if new.subtotal is distinct from old.subtotal
      or new.vat_amount is distinct from old.vat_amount
      or new.total is distinct from old.total
      or new.client_id is distinct from old.client_id
      or new.vat_rate is distinct from old.vat_rate
      or new.issue_date is distinct from old.issue_date
      or new.number is distinct from old.number then
      raise exception 'Facture % verrouillée : émettez un avoir plutôt que de la modifier', old.number;
    end if;
  end if;

  return new;
end;
$$;

create trigger invoices_guard_locked
  before update on invoices
  for each row execute function guard_locked_invoice();

create or replace function guard_locked_invoice_items()
returns trigger
language plpgsql
as $$
declare
  parent_status invoice_status;
  parent_number text;
begin
  select status, number
    into parent_status, parent_number
    from invoices
   where id = coalesce(new.invoice_id, old.invoice_id);

  if parent_status in ('sent', 'paid') then
    raise exception 'Lignes de la facture % verrouillées', parent_number;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger invoice_items_guard_locked
  before insert or update or delete on invoice_items
  for each row execute function guard_locked_invoice_items();
