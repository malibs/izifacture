#!/usr/bin/env bash
# Rejoue les migrations, le seed et les tests d'isolation sur un Postgres jetable.
#
#   ./scripts/test-db.sh
#
# Les objets Supabase (auth.users, storage, auth.uid) sont remplacés par les
# stubs de supabase/tests/stubs.sql.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTAINER="facturation-db-test"

cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT
cleanup

docker run -d --name "$CONTAINER" -e POSTGRES_PASSWORD=postgres postgres:16 >/dev/null

until docker exec "$CONTAINER" pg_isready -q; do sleep 1; done

docker exec "$CONTAINER" psql -U postgres -q -c "create role authenticated nologin; grant authenticated to postgres;"
docker cp "$ROOT/supabase" "$CONTAINER:/tmp/supabase" >/dev/null

docker exec "$CONTAINER" psql -U postgres -q -v ON_ERROR_STOP=1 \
  -f /tmp/supabase/tests/stubs.sql \
  -f /tmp/supabase/migrations/20260828120000_initial_schema.sql \
  -f /tmp/supabase/migrations/20260828120100_rls_policies.sql \
  -f /tmp/supabase/migrations/20260828120200_signup_bootstrap.sql \
  -f /tmp/supabase/seed.sql

docker exec "$CONTAINER" psql -U postgres -q -v ON_ERROR_STOP=1 -f /tmp/supabase/tests/rls_test.sql

echo "Migrations, seed et tests d'isolation: OK"
