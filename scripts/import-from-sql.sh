#!/usr/bin/env bash
# Load a Zenith Growth MySQL dump (.sql), then migrate → Supabase via import-zenith-mysql.ts
#
# Usage:
#   npm run import:zenith-sql
#   npm run import:zenith-sql -- /path/to/your/dump.sql
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DUMP="${1:-$ROOT/data/zenith-mysql.sql}"
ZENITH_LARAVEL="${ZENITH_LARAVEL_ROOT:-$HOME/Downloads/zenithgrowth}"
MYSQL_CONTAINER="${ZENITH_MYSQL_CONTAINER:-greengrowth-mysql}"
MYSQL_DB="${ZENITH_MYSQL_DATABASE:-u228053773_phantom}"
MYSQL_ROOT_PASSWORD="${ZENITH_MYSQL_PASSWORD:-greengrowth}"

if [[ ! -f "$DUMP" ]]; then
  echo "SQL dump not found: $DUMP"
  echo ""
  echo "Place your phpMyAdmin / mysqldump file at:"
  echo "  $ROOT/data/zenith-mysql.sql"
  echo "Or pass the path: npm run import:zenith-sql -- /path/to/dump.sql"
  exit 1
fi

if [[ ! -d "$ZENITH_LARAVEL" ]]; then
  echo "Zenith Laravel folder not found: $ZENITH_LARAVEL"
  echo "Set ZENITH_LARAVEL_ROOT if your clone is elsewhere."
  exit 1
fi

if [[ "${ZENITH_IMPORT_DIRECT:-}" == "1" ]] || ! command -v docker >/dev/null 2>&1; then
  echo "Direct SQL → Postgres import (no Docker) …"
  cd "$ROOT"
  npx tsx scripts/import-zenith-sql-file.ts "$DUMP"
  exit 0
fi

echo "Starting MySQL (Docker) in $ZENITH_LARAVEL ..."
if ! (cd "$ZENITH_LARAVEL" && docker compose up -d mysql 2>/dev/null); then
  echo "Docker unavailable — falling back to direct SQL import …"
  cd "$ROOT"
  npx tsx scripts/import-zenith-sql-file.ts "$DUMP"
  exit 0
fi

echo "Waiting for MySQL ..."
for i in $(seq 1 60); do
  if docker exec "$MYSQL_CONTAINER" mysqladmin ping -h127.0.0.1 -uroot -p"$MYSQL_ROOT_PASSWORD" --silent 2>/dev/null; then
    break
  fi
  sleep 2
  if [[ "$i" -eq 60 ]]; then
    echo "MySQL did not become ready. Is Docker running?"
    exit 1
  fi
done

echo "Recreating database $MYSQL_DB ..."
docker exec "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e \
  "DROP DATABASE IF EXISTS \`$MYSQL_DB\`; CREATE DATABASE \`$MYSQL_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "Importing SQL ($(du -h "$DUMP" | cut -f1)) — may take several minutes ..."
docker exec -i "$MYSQL_CONTAINER" mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DB" < "$DUMP"

echo "Migrating MySQL → Postgres (apextradezone-zenith) ..."
cd "$ROOT"
export ZENITH_MYSQL_HOST="${ZENITH_MYSQL_HOST:-127.0.0.1}"
export ZENITH_MYSQL_PORT="${ZENITH_MYSQL_PORT:-3306}"
export ZENITH_MYSQL_USER="${ZENITH_MYSQL_USER:-root}"
export ZENITH_MYSQL_PASSWORD="$MYSQL_ROOT_PASSWORD"
export ZENITH_MYSQL_DATABASE="$MYSQL_DB"
npm run import:zenith-mysql

echo "Done. Check Supabase Table Editor for User, Transaction, user_plans data."
