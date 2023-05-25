from django.contrib import admin
from django.apps import apps

from apps.Users.models import BoardPost, BasicUser

admin.site.register(BoardPost) 
admin.site.register(BasicUser)