from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.Users.models import BasicUser
from datetime import datetime 
from multiselectfield import MultiSelectField
from .choices import LOGISTICS_CHOICES, ACCESS_NEEDS_CHOICES, FOOD_CATEGORIES, DIET_PREFERENCES

class RequestPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, blank=True) #link to images in DB
    postedOn = models.DateTimeField(default=datetime.now)
    postedBy = models.ForeignKey(BasicUser, on_delete=models.CASCADE, related_name="request_post_by")
    description = models.CharField(max_length=1024, blank=True)
    fulfilled = models.BooleanField(default=False)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=3, default='')
    postalCode = models.CharField(max_length=7, blank=True)
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)], null=True, blank=True, default=None)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)], null=True, blank=True, default=None)
    accessNeeds = models.CharField(choices=ACCESS_NEEDS_CHOICES, default='a', max_length=1)
    categories = MultiSelectField(choices=FOOD_CATEGORIES, max_length=12, default='')
    diet = MultiSelectField(choices=DIET_PREFERENCES, max_length=9, default='')

    def __str__(self):
        return self.title
    
class OfferPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, blank=True) #link to images in DB
    postedOn = models.DateTimeField(default=datetime.now)
    postedBy = models.ForeignKey(BasicUser, on_delete=models.CASCADE, related_name="offer_post_by")
    description = models.CharField(max_length=1024, blank=True)
    fulfilled = models.BooleanField(default=False)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=3, default='')
    postalCode = models.CharField(max_length=7, blank=True)
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)], null=True, blank=True, default=None)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)], null=True, blank=True, default=None)
    accessNeeds = models.CharField(choices=ACCESS_NEEDS_CHOICES, default='a', max_length=1)
    categories = MultiSelectField(choices=FOOD_CATEGORIES, max_length=12, default='')
    diet = MultiSelectField(choices=DIET_PREFERENCES, max_length=9, default='')
    
    def __str__(self):
        return self.title
    