from rest_framework import serializers, fields
from .models import RequestPost, OfferPost
from .choices import LOGISTICS_CHOICES, ACCESS_NEEDS_CHOICES
from apps.Users.models import BasicUser
from django.db import models
from datetime import datetime 

class createRequestSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.DateTimeField(default=datetime.now)
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    fulfilled = serializers.BooleanField(default=False)
    logistics = fields.MultipleChoiceField(choices=LOGISTICS_CHOICES, required=False)
    postalCode = serializers.CharField(max_length=7, required=False, allow_blank=True)
    coordinates = serializers.CharField(max_length=50, required=False, allow_blank=True)
    accessNeeds = serializers.IntegerField()

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates']
    def save(self):
        post=RequestPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'],
                       fulfilled=self.validated_data['fulfilled'],
                       logistics=self.validated_data['logistics'],
                       postalCode=self.validated_data['postalCode'],
                       accessNeeds=self.validated_data['accessNeeds'],
                       coordinates=self.validated_data['coordinates'])
        post.save()

class createOfferSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.DateTimeField(default=datetime.now)
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    fulfilled = serializers.BooleanField(default=False)
    logistics = fields.MultipleChoiceField(choices=LOGISTICS_CHOICES, required=False)
    postalCode = serializers.CharField(max_length=7, required=False, allow_blank=True)
    accessNeeds = serializers.IntegerField()

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates']
    def save(self):
        post=OfferPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'],
                       fulfilled=self.validated_data['fulfilled'],
                       logistics=self.validated_data['logistics'],
                       postalCode=self.validated_data['postalCode'],
                       accessNeeds=self.validated_data['accessNeeds'],
                       coordinates=self.validated_data['coordinates'])
        post.save()