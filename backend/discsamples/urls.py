from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_disc_sample),
    path("list/", views.list_all_disc_samples),
    path("detail/<int:sample_id>/", views.get_disc_sample_details),
    path("update/<int:sample_id>/", views.update_disc_sample),
    path("delete/", views.delete_disc_samples),
    path("Search/", views.search_disc_samples_by_local),

]
