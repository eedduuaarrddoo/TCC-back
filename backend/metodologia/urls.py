from django.urls import path
from .views import (
    create_metodologia,
    list_metodologias,
    get_metodologia_details,
    update_metodologia,
    delete_metodologias,
    search_metodologias_by_nome,
)

urlpatterns = [
    path("create/", create_metodologia, name="create_metodologia"),
    path("listall/", list_metodologias, name="list_metodologias"),
    path("update/<int:metodologia_id>/", update_metodologia, name="update_metodologia"),
    path("delete/", delete_metodologias, name="delete_metodologias"),
    path("detail/<int:metodologia_id>/", get_metodologia_details, name="get_metodologia_details"),
    path("search/nome/", search_metodologias_by_nome, name="search_metodologias_by_material"),
]
