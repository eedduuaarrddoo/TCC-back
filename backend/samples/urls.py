from django.urls import path
from .views import create_sample, list_all_samples, list_samples, delete_samples, update_sample

urlpatterns = [
    path("create/", create_sample, name="create_sample"),
    path("list/", list_samples, name="list_samples"),
    path("listall/", list_all_samples, name="list_all_samples"),
    path("delete/", delete_samples, name="delete_samples"),
    path("update/<int:sample_id>/",update_sample, name="update_sample"),
]
