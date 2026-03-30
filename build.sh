# Build Frontend
echo "== Building Frontend =="
cd frontend
npm install
npm run build
cd ..

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

# Verify existence of index.html
echo "== Verifying Build Artifacts =="
ls -R frontend/dist || echo "frontend/dist not found"
ls -R staticfiles || echo "staticfiles not found"

echo "== Build Finished Successfully =="
