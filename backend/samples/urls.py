from django.urls import path
from .views import create_sample, list_all_samples, list_samples, delete_samples, update_sample ,get_sample_details,get_user_samples_ids,search_samples_by_location

urlpatterns = [
    path("create/", create_sample, name="create_sample"),
    path("list/", list_samples, name="list_samples"),
    path("listall/", list_all_samples, name="list_all_samples"),
    path("delete/", delete_samples, name="delete_samples"),
    path("update/<int:sample_id>/",update_sample, name="update_sample"),
    path('sampledetail/<int:sample_id>/', get_sample_details, name="sample-detail"),
    path('usersamples/<int:user_id>/', get_user_samples_ids, name='user-samples-ids'),
    path("search/location/", search_samples_by_location, name="search_samples_by_location"),
]
