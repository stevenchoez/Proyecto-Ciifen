from django.contrib import admin

from ciifen.inventario.models import Estacion, Instrumento, Mantenimiento

# Register your models here.

admin.site.register(Estacion)
admin.site.register(Instrumento)
admin.site.register(Mantenimiento)
