# Generated by Django 3.1.13 on 2021-07-28 22:33

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vestaweb', '0004_vwp'),
    ]

    operations = [
        migrations.AddField(
            model_name='vwp',
            name='dir',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=[], size=None),
            preserve_default=False,
        ),
    ]