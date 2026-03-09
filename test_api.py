import urllib.request
import json

url = "http://127.0.0.1:8000/users/api/token/"
data = json.dumps({"username": "admin", "password": "admin123"}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
