from django.contrib import admin

from .models import Radar, Palette, ProductDescription

admin.site.register(Radar)
admin.site.register(Palette)
admin.site.register(ProductDescription)
