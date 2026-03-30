#!/bin/bash

echo "== Starting Build Process =="

# Install dependencies
python3 -m pip install -r requirements.txt

# Run migrations to Supabase
echo "== Running Migrations =="
python3 manage.py migrate --noinput

# Create default admin if not exists
echo "== Creating Admin User =="
python3 manage.py shell -c "from users.models import CustomUser; 
if not CustomUser.objects.filter(username='admin').exists():
    u = CustomUser.objects.create_superuser('admin', 'admin@desa.cimanggu.id', 'admin123');
    print('Admin user created successfully');
else:
    print('Admin user already exists');
"

# Collect Static Files
echo "== Collecting Statics =="
python3 manage.py collectstatic --noinput

echo "== Build Finished Successfully =="
