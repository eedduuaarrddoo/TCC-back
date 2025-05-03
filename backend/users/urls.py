from django.urls import path
from users.views import register, login_view, logout_view, delete_user, list_all_users, edit_user
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("allusers/", list_all_users, name="listall"),
    path("update/<int:user_id>/", edit_user, name="edit"),
    path("delete/<int:user_id>/", delete_user, name="delete"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify")
]
