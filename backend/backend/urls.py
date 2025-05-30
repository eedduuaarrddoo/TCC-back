from django.contrib import admin
from django.urls import path, include  
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("users.urls")),  
    path("api/sample/", include("samples.urls")),
    path("api/metodologia/", include("metodologia.urls")),
    path("api/discsamples/", include("discsamples.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)