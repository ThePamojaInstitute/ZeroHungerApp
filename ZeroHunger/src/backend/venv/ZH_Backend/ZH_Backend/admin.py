from django.contrib import admin
from django.apps import apps

from apps.Users.models import BasicUser
from apps.Posts.models import BoardPost

admin.site.register(BoardPost)
admin.site.register(BasicUser)