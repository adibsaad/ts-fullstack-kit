#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

DROP_DB_SQL=$(<$DIR/sql/drop_db.sql)

docker-compose exec postgres psql postgresql://user:password@localhost:5432/postgres -c "$DROP_DB_SQL"
