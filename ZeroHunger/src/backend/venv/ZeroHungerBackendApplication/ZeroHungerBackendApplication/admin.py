from django.contrib import admin
from django.apps import apps

from .models import BoardPost, BasicUser

admin.site.register(BoardPost) 
admin.site.register(BasicUser)