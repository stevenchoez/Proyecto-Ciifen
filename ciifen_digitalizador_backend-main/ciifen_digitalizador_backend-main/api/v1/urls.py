from django.urls import path, include

from api.v1.authentication import urls as urls_autenticacion
from api.v1.inventario import urls as urls_inventario
from api.v1.pluviograma import urls as urls_pluviograma
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('autenticacion/', include(urls_autenticacion)),
    path('inventario/', include(urls_inventario)),
    path('pluviograma/', include(urls_pluviograma)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
