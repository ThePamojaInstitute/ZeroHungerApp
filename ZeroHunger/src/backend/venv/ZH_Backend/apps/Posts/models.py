from django.urls import reverse
from django.db import models

class BoardPost(models.Model):
    title = models.CharField(max_length=128, default="linkhere")
    images = models.CharField(max_length=256, default="linkhere") #link to images in DB
    postedOn = models.IntegerField(default=200000) #Stores time as unix timestamp
    postedBy = models.IntegerField(default=2)#User ID of user who made this post
    description = models.CharField(max_length=1000) 

    def __str__(self):
        return self.title