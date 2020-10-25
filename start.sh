#!/bin/sh

echo "db => running pg_isready until database up"
# make sure pg is ready to accept connections
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
do
  echo "db => database not ready yet, retrying in 2 seconds..."
  sleep 2;
done

# Now able to connect to postgres
DB_URI="postgres://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME" node dist/index.js
