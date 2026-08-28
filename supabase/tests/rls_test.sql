-- Test d'isolation multi-tenant : un utilisateur ne doit jamais voir ni écrire
-- les données d'une autre organisation. À rejouer après toute modification des
-- policies (voir supabase/tests/README.md).

\set ON_ERROR_STOP on

begin;

insert into auth.users (id, email) values
  ('aaaaaaaa-0000-4000-8000-00000000000a', 'a@example.test'),
  ('bbbbbbbb-0000-4000-8000-00000000000b', 'b@example.test');

-- Le trigger d'inscription a créé une organisation et un profil par utilisateur.
create temporary table ctx as
select
  (select organization_id from profiles where id = 'aaaaaaaa-0000-4000-8000-00000000000a') as org_a,
  (select organization_id from profiles where id = 'bbbbbbbb-0000-4000-8000-00000000000b') as org_b;

grant select on ctx to authenticated;

insert into clients (organization_id, name) select org_a, 'Client A' from ctx;
insert into clients (organization_id, name) select org_b, 'Client B' from ctx;

set local role authenticated;
set local request.jwt.claim.sub = 'aaaaaaaa-0000-4000-8000-00000000000a';

do $$
declare
  visible_clients int;
  visible_orgs int;
begin
  select count(*) into visible_clients from clients;
  if visible_clients <> 1 then
    raise exception 'RLS clients: % lignes visibles, 1 attendue', visible_clients;
  end if;

  if (select name from clients) <> 'Client A' then
    raise exception 'RLS clients: mauvaise organisation visible';
  end if;

  select count(*) into visible_orgs from organizations;
  if visible_orgs <> 1 then
    raise exception 'RLS organizations: % lignes visibles, 1 attendue', visible_orgs;
  end if;
end;
$$;

-- Écriture dans l'organisation d'autrui : doit échouer.
do $$
declare
  other_org uuid := (select org_b from ctx);
begin
  begin
    insert into clients (organization_id, name) values (other_org, 'Intrus');
    raise exception 'RLS insert: écriture cross-organisation acceptée';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Mise à jour d'une ligne d'autrui : silencieusement sans effet (0 ligne visible).
do $$
declare
  touched int;
begin
  update clients set name = 'Détourné' where name = 'Client B';
  get diagnostics touched = row_count;
  if touched <> 0 then
    raise exception 'RLS update: % ligne(s) d''une autre organisation modifiée(s)', touched;
  end if;
end;
$$;

reset role;

-- Numérotation transactionnelle : deux appels ne rendent jamais le même numéro.
do $$
declare
  org uuid := (select org_a from ctx);
  first_number text;
  second_number text;
begin
  first_number := next_invoice_number(org);
  second_number := next_invoice_number(org);

  if first_number = second_number then
    raise exception 'Numérotation: doublon %', first_number;
  end if;
end;
$$;

-- Verrou des factures envoyées : modification du montant interdite.
do $$
declare
  org uuid := (select org_a from ctx);
  client uuid := (select id from clients where organization_id = (select org_a from ctx));
  inv uuid;
begin
  insert into invoices (organization_id, client_id, number, due_date, subtotal, vat_amount, total)
  values (org, client, 'TEST-1', current_date + 30, 100000, 18000, 118000)
  returning id into inv;

  update invoices set status = 'sent' where id = inv;

  begin
    update invoices set total = 1 where id = inv;
    raise exception 'Verrou facture: modification acceptée sur une facture envoyée';
  exception
    when raise_exception then
      if sqlerrm like 'Verrou facture:%' then
        raise;
      end if;
  end;

  begin
    insert into invoice_items (invoice_id, description, quantity, unit_price, line_total)
    values (inv, 'Ligne interdite', 1, 1000, 1000);
    raise exception 'Verrou lignes: insertion acceptée sur une facture envoyée';
  exception
    when raise_exception then
      if sqlerrm like 'Verrou lignes:%' then
        raise;
      end if;
  end;
end;
$$;

rollback;

\echo 'RLS et contraintes: OK'
