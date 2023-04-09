from django.contrib import admin
from django.apps import apps

from .models import BoardPost

admin.site.register(BoardPost)