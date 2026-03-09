from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, LandingPageSetting

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'unit_detail', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Informasi Tambahan', {'fields': ('role', 'unit_detail')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informasi Tambahan', {'fields': ('role', 'unit_detail')}),
    )

@admin.register(LandingPageSetting)
class LandingPageSettingAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'contact_email')
    list_filter = ('is_active',)

admin.site.register(CustomUser, CustomUserAdmin)
