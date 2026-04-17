import os
import requests
import mimetypes
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from django.conf import settings

@deconstructible
class SupabaseStorage(Storage):
    def __init__(self, bucket_name='media'):
        self.project_url = getattr(settings, 'SUPABASE_URL', 'https://yupabeqtuqiajxgnvkup.supabase.co')
        self.service_key = getattr(settings, 'SUPABASE_SERVICE_KEY', '')
        self.bucket_name = bucket_name
        self.base_url = f"{self.project_url}/storage/v1/object/public/{self.bucket_name}/"
        self.api_url = f"{self.project_url}/storage/v1/object/{self.bucket_name}/"
        
        self.headers = {
            'Authorization': f'Bearer {self.service_key}',
        }

    def _save(self, name, content):
        # Clean path for Supabase
        clean_name = name.replace('\\', '/')
        upload_url = self.api_url + clean_name
        
        content.seek(0)
        file_data = content.read()
        
        # Guess mime type
        mime_type, _ = mimetypes.guess_type(name)
        if not mime_type:
            mime_type = 'application/octet-stream'
            
        upload_headers = self.headers.copy()
        upload_headers['Content-Type'] = mime_type
        
        # 1. Try to upload (POST)
        response = requests.post(upload_url, headers=upload_headers, data=file_data)
        
        # 2. If it already exists (400 Duplicate), try to overwrite (PUT)
        if response.status_code == 400 and 'Duplicate' in response.text:
            # Note: For some Supabase versions, overwrite is handled via x-upsert header or PUT
            # We'll use PUT which is common for updates
            response = requests.put(upload_url, headers=upload_headers, data=file_data)
        
        if response.status_code not in (200, 201):
            # Log failure but don't necessarily crash everything if it's non-critical
            print(f"Supabase storage error: {response.status_code} - {response.text}")
                
        return clean_name

    def exists(self, name):
        # We assume false to allow Django to overwrite or generate new suffixes, 
        # but to save API calls we'll always generate unique names natively in Django
        return False

    def url(self, name):
        clean_name = name.replace('\\', '/')
        # Return the public URL to access the image
        return self.base_url + clean_name
