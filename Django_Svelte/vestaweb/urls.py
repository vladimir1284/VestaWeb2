from django.urls import re_path, path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path(r'', TemplateView.as_view(template_name="index.html"))
    # re_path(r'^.*$', TemplateView.as_view(template_name="index.html"))
]
