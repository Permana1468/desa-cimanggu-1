"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse
import sys, os


def health_check(request):
    """Diagnostic endpoint to verify Django is running correctly."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, 'frontend', 'dist', 'index.html')
    staticfiles_path = os.path.join(base_dir, 'staticfiles')
    return JsonResponse({
        'status': 'ok',
        'django': 'running',
        'python_version': sys.version,
        'base_dir': base_dir,
        'index_html_exists': os.path.exists(index_path),
        'staticfiles_exists': os.path.exists(staticfiles_path),
        'index_in_staticfiles': os.path.exists(os.path.join(staticfiles_path, 'index.html')),
    })


urlpatterns = [
    path('test-health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    # Catch-all route to serve React frontend
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
