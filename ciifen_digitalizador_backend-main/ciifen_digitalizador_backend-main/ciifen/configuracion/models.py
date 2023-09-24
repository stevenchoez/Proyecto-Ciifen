from django.db import models

from django.db import models
from django.contrib.auth.models import User, AbstractUser


class DetalleUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cedula = models.CharField(max_length=100)
    telefono = models.CharField(max_length=50)
    direccion = models.CharField(max_length=255)

    def __str__(self):
        return self.user.get_full_name()
