from django.db import models
from django.contrib.postgres import fields

class Radar(models.Model):
    STATUS_CHOICES = (
                        ('active', 'Activo'),
                        ('inactive', 'Inactivo'),
                        )

    radar_code = models.CharField(max_length=4)
    name = models.CharField(max_length=250)
    status = models.CharField(max_length=20,
                            choices=STATUS_CHOICES,
                            default='active')
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        ordering = ('longitude',)

    def __str__(self):
        return self.name

class Palette(models.Model):
    name = models.CharField(max_length=20)
    min_value = models.FloatField()
    max_value = models.FloatField()
    unit = models.CharField(max_length=10)
    tickValues = fields.ArrayField(models.FloatField())
    colors = fields.ArrayField(models.CharField(max_length=7))

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name

class ProductDescription(models.Model):
    pcode = models.CharField(max_length=10)
    name = models.CharField(max_length=250)
    range = models.IntegerField()
    palette = models.ForeignKey(Palette,
                                on_delete=models.CASCADE,
                                related_name='raster_product')

    class Meta:
        ordering = ('pcode',)

    def __str__(self):
        return self.name

class RasterProduct(models.Model):
    created = models.DateTimeField()
    radar = models.ForeignKey(Radar,
                            on_delete=models.CASCADE,
                            related_name='raster_product')
    description = models.ForeignKey(ProductDescription,
                                on_delete=models.CASCADE,
                                related_name='raster_product')

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return self.description

class AdaptationData(models.Model):
    body = models.TextField(unique = True)

class StormCell(models.Model):
    created = models.DateTimeField()
    label = models.CharField(max_length=2)
    radar = models.ForeignKey(Radar,
                            on_delete=models.CASCADE,
                            related_name='storm_cell')
    adata = models.ForeignKey(AdaptationData,
                            on_delete=models.CASCADE,
                            related_name='storm_cell')
    azimut = models.IntegerField()
    range = models.IntegerField()
    tops = fields.ArrayField(models.FloatField())
    bases = fields.ArrayField(models.FloatField())
    max_ref_hgts = fields.ArrayField(models.FloatField())
    centroids = fields.ArrayField(models.FloatField())
    poh = fields.ArrayField(models.IntegerField())
    posh = fields.ArrayField(models.IntegerField())
    vil = fields.ArrayField(models.IntegerField())
    maxZ = fields.ArrayField(models.IntegerField())
    time = fields.ArrayField(models.IntegerField())

    class Meta:
        ordering = ('-created','radar','-vil')

    def __str__(self):
        return self.label

class StormTracking(models.Model):
    created = models.DateTimeField()
    label = models.CharField(max_length=2)
    radar = models.ForeignKey(Radar,
                            on_delete=models.CASCADE,
                            related_name='storm_tracking')
    Ipos = models.IntegerField()
    Jpos = models.IntegerField()
    past_Ipos  = fields.ArrayField(models.IntegerField())
    past_Jpos  = fields.ArrayField(models.IntegerField())
    forecast_Ipos  = fields.ArrayField(models.IntegerField())
    forecast_Jpos  = fields.ArrayField(models.IntegerField())

    class Meta:
        ordering = ('-created','radar','Ipos')

    def __str__(self):
        return self.label

class VWP(models.Model):
    created = models.DateTimeField()
    radar = models.ForeignKey(Radar,
                            on_delete=models.CASCADE,
                            related_name='vwp')
    hts  = fields.ArrayField(models.IntegerField())
    u  = fields.ArrayField(models.FloatField())
    v  = fields.ArrayField(models.FloatField())
    w  = fields.ArrayField(models.FloatField())
    dir  = fields.ArrayField(models.IntegerField())
    rms = fields.ArrayField(models.FloatField())
    div = fields.ArrayField(models.FloatField())
    srng = fields.ArrayField(models.FloatField())
    elev = fields.ArrayField(models.FloatField())

    class Meta:
        ordering = ('-created','radar')

    def __str__(self):
        return self.label
