from rest_framework import viewsets, status
from rest_framework.response import Response

from api.v1.inventario.serializers import EstacionSerializer, InstrumentoSerializer, MantenimientoSerializer
from ciifen.inventario.models import Estacion, Instrumento, Mantenimiento


class EstacionViewSet(viewsets.ModelViewSet):
    queryset = Estacion.objects.all().order_by('-id')
    serializer_class = EstacionSerializer


class InstrumentoViewSet(viewsets.ModelViewSet):
    queryset = Instrumento.objects.all().order_by('-id')
    serializer_class = InstrumentoSerializer

    def get_queryset(self):
        queryset = Instrumento.objects.all().order_by('-id')
        estacion_id = self.request.query_params.get('estacion', None)

        if estacion_id:
            queryset = queryset.filter(estacion__id=estacion_id)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all().order_by('-id')
    serializer_class = MantenimientoSerializer
