from django.urls import re_path, path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path(r'', TemplateView.as_view(template_name="index.html")),
    path('<radar>/<pcode>/last',
            views.last_raster,
            name='last_raster'),
    path('<radar>/<pcode>/<dt>/<int:n>',
            views.raster_array,
            name='raster_array'),
    path('<radar>/<pcode>/closest/<dt>',
            views.get_closest_raster,
            name='closest_raster'),
    path('<radar>/<pcode>/next/<dt>',
            views.get_next_raster,
            name='next_raster'),
    path('<radar>/<pcode>/previous/<dt>',
            views.get_previous_raster,
            name='previous_raster'),
    path('palette/<palette_name>',
            views.get_palette,
            name='get_palette'),
    path('<radar>/available/<dt>',
            views.get_available,
            name='get_available'),
    path('<radar>/storm_cells/<dt>',
            views.get_storm_cells,
            name='get_storm_cells'),
    path('<radar>/adata/ss/<dt>',
            views.get_ss_adata,
            name='get_ss_adata'),
    path('get_radars',
            views.get_radars,
            name='get_radars'),
    # re_path(r'^.*$', TemplateView.as_view(template_name="index.html"))
]
