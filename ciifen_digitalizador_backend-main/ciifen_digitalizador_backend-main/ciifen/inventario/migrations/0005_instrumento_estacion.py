# Generated by Django 3.2.19 on 2023-08-14 21:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0004_auto_20230809_1740'),
    ]

    operations = [
        migrations.AddField(
            model_name='instrumento',
            name='estacion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='instrumentos', to='inventario.estacion'),
        ),
    ]
