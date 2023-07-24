from rest_framework import serializers, fields
from .models import RequestPost, OfferPost
from .choices import LOGISTICS_CHOICES, ACCESS_NEEDS_CHOICES, FOOD_CATEGORIES, DIET_PREFERENCES
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
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates', 'categories', 'diet']
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
                       coordinates=self.validated_data['coordinates'],
                       categories=self.validated_data['categories'],
                       diet=self.validated_data['diet'],)
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
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates', 'categories', 'diet']
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
                       coordinates=self.validated_data['coordinates'],
                       categories=self.validated_data['categories'],
                       diet=self.validated_data['diet'],)
        post.save()