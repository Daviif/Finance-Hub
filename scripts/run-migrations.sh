#!/bin/sh
set -e

export PGPASSWORD="${DB_PASSWORD}"

echo "Aguardando Postgres em ${DB_HOST}:${DB_PORT}..."
until psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  sleep 1
done
echo "Postgres pronto."

echo "Executando migrations..."
for f in $(ls /migrations/*.sql 2>/dev/null | sort); do
  echo "  -> $f"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$f" || exit 1
done
echo "Migrations e seed concluídos."