import os
import django
import sys

# Get the absolute path of the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import CustomUser, UMKMShop, Product

print("--- DIAGNOSTIC: UMKM DATA SYNC ---")

# 1. Users with OWNER_TOKO role
owners = CustomUser.objects.filter(role='OWNER_TOKO')
print(f"Total Users with role OWNER_TOKO: {owners.count()}")
for u in owners:
    print(f" - {u.username} (Verified: {u.is_verified}, Status: {u.status})")

# 2. Existing Shops
shops = UMKMShop.objects.all()
print(f"\nTotal Shops in Database: {shops.count()}")
for s in shops:
    print(f" - Shop: {s.shop_name} | Owner: {s.owner.username} | Verified: {s.is_verified}")

# 3. Existing Products
products = Product.objects.all()
print(f"\nTotal Products in Database: {products.count()}")
for p in products:
    print(f" - Product: {p.name} | Shop: {p.shop.shop_name} | Price: {p.price}")

print("\n--- END DIAGNOSTIC ---")
