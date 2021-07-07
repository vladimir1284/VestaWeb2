# Generated by Django 3.1.13 on 2021-07-06 23:33

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdaptationData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Palette',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('min_value', models.FloatField()),
                ('max_value', models.FloatField()),
                ('unit', models.CharField(max_length=10)),
                ('tickValues', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('colors', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=7), size=None)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='ProductDescription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pcode', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=250)),
                ('range', models.IntegerField()),
                ('palette', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='raster_product', to='vestaweb.palette')),
            ],
            options={
                'ordering': ('pcode',),
            },
        ),
        migrations.CreateModel(
            name='Radar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('radar_code', models.CharField(max_length=4)),
                ('name', models.CharField(max_length=250)),
                ('status', models.CharField(choices=[('active', 'Activo'), ('inactive', 'Inactivo')], default='active', max_length=20)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
            options={
                'ordering': ('longitude',),
            },
        ),
        migrations.CreateModel(
            name='StormCell',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField()),
                ('label', models.CharField(max_length=2)),
                ('azimut', models.IntegerField()),
                ('range', models.IntegerField()),
                ('Ipos', models.IntegerField()),
                ('Jpos', models.IntegerField()),
                ('tops', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('bases', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('max_ref_hgts', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('centroids', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('poh', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('posh', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('vil', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('maxZ', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('time', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('past_Ipos', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('past_Jpos', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('forecast_Ipos', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('forecast_Jpos', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('adata', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='storm_cell', to='vestaweb.adaptationdata')),
                ('radar', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='storm_cell', to='vestaweb.radar')),
            ],
            options={
                'ordering': ('-created', 'radar', '-vil'),
            },
        ),
        migrations.CreateModel(
            name='RasterProduct',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField()),
                ('description', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='raster_product', to='vestaweb.productdescription')),
                ('radar', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='raster_product', to='vestaweb.radar')),
            ],
            options={
                'ordering': ('-created',),
            },
        ),
    ]
