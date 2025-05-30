from rest_framework.permissions import BasePermission

class IsCustomAdmin(BasePermission):
   
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "is_admin", False)
        )
