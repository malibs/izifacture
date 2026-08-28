-- À l'inscription, chaque utilisateur reçoit son organisation et son profil.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
begin
  insert into organizations (name, email)
  values (
    coalesce(new.raw_user_meta_data ->> 'company_name', 'Mon entreprise'),
    new.email
  )
  returning id into org_id;

  insert into profiles (id, organization_id, full_name, role)
  values (
    new.id,
    org_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'owner'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
