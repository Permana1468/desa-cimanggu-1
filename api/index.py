import sys
import os
import traceback
from django.core.wsgi import get_wsgi_application

# Add the current directory to the system path to ensure the 'backend' folder is found
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

try:
    # Set the settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    
    # Initialize the WSGI application
    # This call triggers the bulk of Django's initialization.
    application = get_wsgi_application()
    app = application

except Exception as e:
    # If anything fails during boot, catch it and provide a diagnostic response
    # This prevents the raw 500 error and shows the actual traceback in the browser
    error_traceback = traceback.format_exc()
    
    def app(environ, start_response):
        status = '200 OK'  # Return 200 so Vercel doesn't hide the message
        response_headers = [('Content-type', 'text/plain; charset=utf-8')]
        start_response(status, response_headers)
        
        diagnostic_msg = (
            "--- DJANGO BOOT ERROR (Vercel Diagnostic Mode) ---\n\n"
            f"ERROR: {str(e)}\n\n"
            "TRACEBACK:\n"
            f"{error_traceback}\n"
            "\n--- END OF DIAGNOSTICS ---"
        )
        return [diagnostic_msg.encode('utf-8')]
