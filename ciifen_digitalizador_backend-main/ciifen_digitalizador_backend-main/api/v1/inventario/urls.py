from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.v1.inventario import views

router = DefaultRouter()
router.register(r'estacion', views.EstacionViewSet)
router.register(r'instrumento', views.InstrumentoViewSet)
router.register(r'mantenimiento', views.MantenimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
