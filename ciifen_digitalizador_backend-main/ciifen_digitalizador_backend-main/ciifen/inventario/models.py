from django.db import models

from ciifen.base.models import ModeloBase


class Estacion(ModeloBase):
    nombre = models.CharField(max_length=255, null=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    altitud = models.DecimalField(max_digits=7, decimal_places=2, null=True)

    class Meta:
        verbose_name_plural = "Estaciones"


class Instrumento(ModeloBase):
    marca = models.CharField(max_length=50, null=True)
    modelo = models.CharField(max_length=50, null=True)
    serial = models.CharField(max_length=50, null=True)
    estacion = models.ForeignKey(
        Estacion,
        on_delete=models.CASCADE,
        related_name='instrumentos',
        null=True
    )


class Mantenimiento(ModeloBase):
    instrumento = models.ForeignKey(
        Instrumento,
        on_delete=models.CASCADE,
        related_name='mantenimientos',
        null=True
    )
    tipo = models.CharField(max_length=30, null=True)
    fecha = models.DateTimeField(null=True)
    detalle = models.TextField(null=True)
