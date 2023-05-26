from django.contrib import admin
from django.apps import apps

from apps.Users.models import BasicUser

admin.site.register(BasicUser)