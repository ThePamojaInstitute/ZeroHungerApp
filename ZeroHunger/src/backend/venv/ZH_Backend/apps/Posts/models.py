from django.db import models


class RequestPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, default="linkToImageDB") #link to images in DB
    postedOn = models.IntegerField(default=1) #Stores time as unix timestamp, defaults to UTC
    postedBy = models.IntegerField(default=2)#User ID of user who made this post
    description = models.CharField(max_length=1024)
    postType = models.CharField(max_length=1, default="r")

    def __str__(self):
        return self.title

class OfferPost(models.Model):
    title = models.CharField(max_length=128, default="Untitled")
    images = models.CharField(max_length=256, default="linkToImageDB") #link to images in DB
    postedOn = models.IntegerField(default=1) #Stores time as unix timestamp, defaults to UTC
    postedBy = models.IntegerField(default=2)#User ID of user who made this post
    description = models.CharField(max_length=1024)
    postType = models.CharField(max_length=1, default="o")

    def __str__(self):
        return self.title
