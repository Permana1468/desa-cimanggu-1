from backend.wsgi import application

# This is the entry point for Vercel. 
# By having this in the root, Vercel bundles the entire project directory.
app = application
