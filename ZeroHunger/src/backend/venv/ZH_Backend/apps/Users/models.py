from django.db import models
from django.conf import settings

from django.contrib.auth.base_user import AbstractBaseUser
from multiselectfield import MultiSelectField
from .choices import LOGISTICS_CHOICES, DIET_REQUIREMENTS

from .managers import CustomUserManager
# from .settings import AUTH_USER_MODEL
from django.contrib.auth.models import PermissionsMixin

import requests

class BasicUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    USERNAME_FIELD = "username"
    email = models.CharField(max_length=128, unique = True )
    EMAIL_FIELD = "email"
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    expo_push_token = models.CharField(max_length=50, default="", blank=True)
    postalCode = models.CharField(max_length=7, blank=True)
    coordinates = models.CharField(max_length=50, blank=True)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=len(LOGISTICS_CHOICES), default='', blank=True)
    diet = MultiSelectField(choices=DIET_REQUIREMENTS, max_length=len(DIET_REQUIREMENTS), default='', blank=True)
    notifications = models.JSONField(default=list)

    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.get_username()
    
    def get_expo_push_token(self):
        return self.expo_push_token
    
    def set_expo_push_token(self, token):
        self.expo_push_token = token

    def get_postal_code(self):
        return self.postalCode

    def set_postal_code(self, postal_code):
        self.postalCode = postal_code

    def get_logistics(self):
        return self.logistics

    def set_logistics(self, logistics):
        self.logistics = logistics

    def get_diet(self):
        return self.diet

    def set_diet(self, diet):
        self.diet = diet
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def update_coordinates(self):
        url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{self.postalCode}.json?access_token={settings.MAPBOX_ACCESS_CODE}'
        res = requests.get(url, headers={'User-Agent': "python-requests/2.31.0"})
        json = res.json()

        longitude = json['features'][0]['center'][0] 
        latitude = json['features'][0]['center'][1] 
        coordinated = f'{longitude},{latitude}'

        self.coordinates = coordinated
