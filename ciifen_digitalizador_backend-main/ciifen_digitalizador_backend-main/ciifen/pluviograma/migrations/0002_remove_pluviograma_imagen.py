# Generated by Django 3.2.19 on 2023-07-21 22:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pluviograma', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pluviograma',
            name='imagen',
        ),
    ]
