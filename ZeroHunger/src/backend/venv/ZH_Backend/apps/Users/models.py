from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.urls import reverse

from .managers import CustomUserManager
# from .settings import AUTH_USER_MODEL
from django.contrib.auth.models import PermissionsMixin

class BasicUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    USERNAME_FIELD = "username"
    email = models.CharField(max_length=128, unique = True )
    EMAIL_FIELD = "email"
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    expo_push_token = models.CharField(max_length=50, default="", blank=True)
    notifications = models.JSONField(default=list)

    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.get_username()
    
    def get_expo_push_token(self):
        return self.expo_push_token
    
    def set_expo_push_token(self, token):
        self.expo_push_token = token
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
