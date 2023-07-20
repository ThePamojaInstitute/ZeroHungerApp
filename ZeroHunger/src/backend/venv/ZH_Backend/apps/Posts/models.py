from django.db import models
from apps.Users.models import BasicUser
from datetime import datetime 
from multiselectfield import MultiSelectField
from .choices import LOGISTICS_CHOICES, ACCESS_NEEDS_CHOICES

class RequestPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, blank=True) #link to images in DB
    postedOn = models.DateTimeField(default=datetime.now)
    postedBy = models.ForeignKey(BasicUser, on_delete=models.CASCADE, related_name="request_post_by")
    description = models.CharField(max_length=1024, blank=True)
    fulfilled = models.BooleanField(default=False)
    logistics = MultiSelectField(choices=LOGISTICS_CHOICES, max_length=3, default='')
    postalCode = models.CharField(max_length=7, blank=True)
    coordinates = models.CharField(max_length=50, blank=True)
    accessNeeds = models.IntegerField(choices=ACCESS_NEEDS_CHOICES, default=0)

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
    coordinates = models.CharField(max_length=50, blank=True)
    accessNeeds = models.IntegerField(choices=ACCESS_NEEDS_CHOICES, default=0)
    
    def __str__(self):
        return self.title

