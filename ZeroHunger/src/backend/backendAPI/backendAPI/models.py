from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.urls import reverse

from .managers import CustomUserManager

class BoardPost(models.Model):

    _productType = models.CharField(max_length=100)
    _postedBy = models.IntegerField() #User ID
    _postedOn = models.DateTimeField()
    _postCaption = models.CharField(max_length=1000)
    #add image data here

class BasicUser(AbstractBaseUser):
    identifier = models.CharField(max_length=50, unique=True)
    USERNAME_FIELD = "identifier"
    email = models.CharField(max_length=128, unique = True )
    EMAIL_FIELD = "email"

    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.get_username()

   
