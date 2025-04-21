from django.urls import path
from users.views import register, login_view, logout_view, delete_user, list_all_users, edit_user

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("update/<int:user_id>/", edit_user, name="edit"),
    path("delete/<int:user_id>/",delete_user, name="delete"),
    path("allusers/", list_all_users, name="list_all_users"),
]
