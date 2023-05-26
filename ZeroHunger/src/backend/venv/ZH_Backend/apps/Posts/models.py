from django.urls import reverse
from django.db import models

class BoardPost(models.Model):

    _productType = models.CharField(max_length=100)
    _postedBy = models.IntegerField() #User ID
    _postedOn = models.DateTimeField()
    _postCaption = models.CharField(max_length=1000)
    #add image data here