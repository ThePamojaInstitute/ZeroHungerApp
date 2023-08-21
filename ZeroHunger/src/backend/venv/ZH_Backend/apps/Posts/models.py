from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.Users.models import BasicUser
from datetime import datetime 
from dateutil.relativedelta import relativedelta
from multiselectfield import MultiSelectField
from .choices import LOGISTICS_CHOICES, FOOD_CATEGORIES, DIET_PREFERENCES


def one_month_from_today():
    return datetime.now() + relativedelta(months=1)

class RequestPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, blank=True) #link to images in DB
    postedOn = models.DateTimeField(default=datetime.now)
    postedBy = models.ForeignKey(BasicUser, on_delete=models.CASCADE, related_name="request_post_by")
    description = models.CharField(max_length=1024, blank=True)
    fulfilled = models.BooleanField(default=False)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=((len(LOGISTICS_CHOICES)*2)-1), default='')
    postalCode = models.CharField(max_length=7, blank=True)
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)], null=True, blank=True, default=None)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)], null=True, blank=True, default=None)
    accessNeeds = models.CharField(max_length=128, blank=True)
    categories = MultiSelectField(choices=FOOD_CATEGORIES, max_length=((len(FOOD_CATEGORIES)*2)-1), default='')
    diet = MultiSelectField(choices=DIET_PREFERENCES, max_length=((len(DIET_PREFERENCES)*2)-1), default='')
    expiryDate = models.DateTimeField(default=one_month_from_today)

    def __str__(self):
        return self.title
    
class OfferPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, blank=True) #link to images in DB
    postedOn = models.DateTimeField(default=datetime.now)
    postedBy = models.ForeignKey(BasicUser, on_delete=models.CASCADE, related_name="offer_post_by")
    description = models.CharField(max_length=128, blank=True)
    fulfilled = models.BooleanField(default=False)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=((len(LOGISTICS_CHOICES)*2)-1), default='')
    postalCode = models.CharField(max_length=7, blank=True)
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)], null=True, blank=True, default=None)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)], null=True, blank=True, default=None)
    accessNeeds = models.CharField(max_length=1024, blank=True)
    categories = MultiSelectField(choices=FOOD_CATEGORIES, max_length=((len(FOOD_CATEGORIES)*2)-1), default='')
    diet = MultiSelectField(choices=DIET_PREFERENCES, max_length=((len(DIET_PREFERENCES)*2)-1), default='')
    expiryDate = models.DateTimeField(default=one_month_from_today)
    
    def __str__(self):
        return self.title
    