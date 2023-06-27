from rest_framework import serializers
from .models import RequestPost, OfferPost
from apps.Users.models import BasicUser
from apps.Users.serializers import UserSerializer
from django.db import models

class createRequestSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.IntegerField(min_value = 1, max_value= 2147483647) #Checks the time value is within 32 bit integer limit and is not negative
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                  'description']
    def save(self):
        post=RequestPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'])
        post.save()

class createOfferSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.IntegerField(min_value = 1, max_value= 2147483647) #Checks the time value is within 32 bit integer limit and is not negative
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                  'description']
    def save(self):
        post=OfferPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'])
        post.save()