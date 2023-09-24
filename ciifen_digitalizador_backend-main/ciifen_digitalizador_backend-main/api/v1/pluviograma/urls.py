from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.v1.pluviograma import views
from api.v1.pluviograma.views import ImageUploadView, DeletePointsView, InterpolateGraphView, \
    GenerateTimeSeriesImageView, TimeSeriesView

router = DefaultRouter()
router.register(r'modelo-pluviograma', views.ModeloViewSet)
router.register(r'', views.PluviogramaViewSet)

urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('delete/', DeletePointsView.as_view(), name='delete-points'),
    path('interpolate/', InterpolateGraphView.as_view(), name='interpolate-graph'),
    path('time-series/', GenerateTimeSeriesImageView.as_view(), name='time-series'),
    path('time-series-intervals/', TimeSeriesView.as_view(), name='time-series-intervals'),
    path('', include(router.urls)),
]
