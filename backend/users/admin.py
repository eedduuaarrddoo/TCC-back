from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "id", "username", "email", "first_name", "last_name", "is_admin",
        "is_superuser", "is_staff", "is_active", "date_joined", "last_login"
    )
    search_fields = ("username", "email", "first_name", "last_name")
    list_filter = ("is_admin", "is_superuser", "is_staff", "is_active", "date_joined")
    ordering = ("id",)

    fieldsets = (
        ("Informações Básicas", {"fields": ("username", "password")}),
        ("Dados Pessoais", {"fields": ("first_name", "last_name", "email")}),
        ("Permissões", {"fields": ("is_admin", "is_superuser", "is_staff", "is_active", "groups", "user_permissions")}),
        ("Datas Importantes", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        ("Novo Usuário", {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "email", "first_name", "last_name", "is_admin", "is_superuser", "is_staff", "is_active"),
        }),
    )
