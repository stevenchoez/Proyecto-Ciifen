from django.db import models
from django.utils import timezone


class ModeloBase(models.Model):
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)

    class Meta:
        abstract = True
