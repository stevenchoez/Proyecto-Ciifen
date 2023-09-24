from django.db import models

from ciifen.base.models import ModeloBase
from ciifen.inventario.models import Estacion, Instrumento


# Create your models here.
class Modelo(ModeloBase):
    nombre = models.CharField(max_length=255, null=True)
    limite_inferior = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    hora_inicio = models.TimeField(max_length=255, null=True)

    def __str__(self):
        return self.nombre


class Pluviograma(ModeloBase):
    fecha_inicio = models.DateTimeField(null=True)
    fecha_fin = models.DateTimeField(null=True)
    url_trazabilidad = models.CharField(max_length=100, null=True)
    url_serie_tiempo = models.CharField(max_length=100, null=True)
    modelo = models.ForeignKey(
        Modelo,
        on_delete=models.SET_NULL,
        null=True,
        related_name='pluviogramas'
    )
    estacion = models.ForeignKey(
        Estacion,
        on_delete=models.SET_NULL,
        null=True,
        related_name='pluviogramas'
    )
    instrumento = models.ForeignKey(
        Instrumento,
        on_delete=models.SET_NULL,
        null=True,
        related_name='pluviogramas'
    )
