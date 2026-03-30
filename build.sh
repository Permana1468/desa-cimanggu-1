#!/bin/bash

echo "== Starting Build Process =="

# Install dependencies
python3 -m pip install -r requirements.txt

# Run migrations to Supabase
echo "== Running Migrations =="
python3 manage.py migrate --noinput

# Collect Static Files
echo "== Collecting Statics =="
python3 manage.py collectstatic --noinput

echo "== Build Finished Successfully =="
