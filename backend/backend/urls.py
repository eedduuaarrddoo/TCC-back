from django.contrib import admin
from django.urls import path, include  

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("users.urls")),  
    path("api/sample/", include("samples.urls")),
    path("api/metodologia/", include("metodologia.urls")),
]
