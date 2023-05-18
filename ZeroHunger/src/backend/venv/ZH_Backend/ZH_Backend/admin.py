from django.contrib import admin
from django.apps import apps

from apps.User_Reg_Auth_App.models import BoardPost, BasicUser

admin.site.register(BoardPost) 
admin.site.register(BasicUser)