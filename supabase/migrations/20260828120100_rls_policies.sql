-- RLS activée dès la création : chaque ligne est scopée par organisation.

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;

-- Organisation de l'utilisateur courant. STABLE + security definer pour éviter
-- une récursion de policy sur profiles.
create or replace function current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from profiles where id = auth.uid();
$$;

create policy organizations_select on organizations
  for select using (id = current_organization_id());

create policy organizations_update on organizations
  for update using (id = current_organization_id())
  with check (id = current_organization_id());

create policy profiles_select on profiles
  for select using (organization_id = current_organization_id());

create policy profiles_update_self on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

create policy clients_select on clients
  for select using (organization_id = current_organization_id());

create policy clients_insert on clients
  for insert with check (organization_id = current_organization_id());

create policy clients_update on clients
  for update using (organization_id = current_organization_id())
  with check (organization_id = current_organization_id());

create policy clients_delete on clients
  for delete using (organization_id = current_organization_id());

create policy invoices_select on invoices
  for select using (organization_id = current_organization_id());

create policy invoices_insert on invoices
  for insert with check (organization_id = current_organization_id());

create policy invoices_update on invoices
  for update using (organization_id = current_organization_id())
  with check (organization_id = current_organization_id());

create policy invoices_delete on invoices
  for delete using (
    organization_id = current_organization_id()
    and status = 'draft'
  );

create policy invoice_items_select on invoice_items
  for select using (
    exists (
      select 1 from invoices i
       where i.id = invoice_items.invoice_id
         and i.organization_id = current_organization_id()
    )
  );

create policy invoice_items_write on invoice_items
  for all using (
    exists (
      select 1 from invoices i
       where i.id = invoice_items.invoice_id
         and i.organization_id = current_organization_id()
    )
  )
  with check (
    exists (
      select 1 from invoices i
       where i.id = invoice_items.invoice_id
         and i.organization_id = current_organization_id()
    )
  );

create policy payments_select on payments
  for select using (organization_id = current_organization_id());

create policy payments_insert on payments
  for insert with check (organization_id = current_organization_id());

create policy payments_delete on payments
  for delete using (organization_id = current_organization_id());

-- Les droits SQL restent larges : c'est la RLS qui cloisonne les organisations.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant usage on schema public to authenticated;
    grant select, insert, update, delete on all tables in schema public to authenticated;
    grant execute on all functions in schema public to authenticated;
  end if;
end;
$$;

-- Logo d'entreprise : bucket privé, accès via URL signée.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', false)
on conflict (id) do nothing;

create policy logos_read on storage.objects
  for select using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = current_organization_id()::text
  );

create policy logos_write on storage.objects
  for insert with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = current_organization_id()::text
  );

create policy logos_update on storage.objects
  for update using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = current_organization_id()::text
  );

create policy logos_delete on storage.objects
  for delete using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = current_organization_id()::text
  );
