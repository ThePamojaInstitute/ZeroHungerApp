import collections
from rest_framework import serializers, fields
from .models import RequestPost, OfferPost
from .choices import LOGISTICS_CHOICES, FOOD_CATEGORIES, DIET_PREFERENCES
from apps.Users.models import BasicUser
from django.db import models
from datetime import datetime 
import json


class createRequestSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.DateTimeField(default=datetime.now)
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    fulfilled = serializers.BooleanField(default=False)
    logistics = fields.MultipleChoiceField(choices=LOGISTICS_CHOICES, required=False)
    postalCode = serializers.CharField(max_length=7, required=False, allow_blank=True)
    longitude = serializers.FloatField(required=False, default=None)
    latitude = serializers.FloatField(required=False, default=None)
    accessNeeds = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)
    distance = serializers.FloatField(required=False)
    expiryDate = models.DateTimeField()

    # These fields are temporary fields and won't be saved in the database
    # distance = serializers.SerializerMethodField(method_name='get_distance')
    username = serializers.SerializerMethodField(method_name='get_username')
    type = serializers.SerializerMethodField(method_name='get_type')
    postId = serializers.SerializerMethodField(method_name='get_postId')

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'longitude', 'latitude', 'categories', 'diet',
                'distance', 'username', 'type', 'postId', 'expiryDate']
        
    def get_username(self, obj):
        if(type(obj) == collections.OrderedDict): # on creation
            return None
       # obj.postedBy
       #log object type
        if (type(obj) == dict ):
             user = obj['postedBy']
        else:
            user = obj.postedBy

        return user.username
    
    def get_type(self, obj):
        return 'r'
    
    def get_postId(self, obj):
        if(type(obj) == collections.OrderedDict): # on creation
            return None
       # print (self)
        #get obj type
        #if dict get the post from database for pk before calling obj.pk
        #if not obj.pk is fine
        if (type(obj) == dict):
            post = RequestPost.objects.get(title=obj['title'] ,postedOn=obj['postedOn'])
            return post.pk
        else:
            return obj.pk
        
      


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
                       longitude=self.validated_data['longitude'],
                       latitude=self.validated_data['latitude'],
                       categories=self.validated_data['categories'],
                       diet=self.validated_data['diet'],
                       expiryDate=self.validated_data['expiryDate'])
        post.save()

class createOfferSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.DateTimeField(default=datetime.now)
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    fulfilled = serializers.BooleanField(default=False)
    logistics = fields.MultipleChoiceField(choices=LOGISTICS_CHOICES, required=False)
    longitude = serializers.FloatField()
    latitude = serializers.FloatField()
    postalCode = serializers.CharField(max_length=7, required=False, allow_blank=True)
    accessNeeds = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)
    distance = serializers.FloatField(required=False)
    expiryDate = models.DateTimeField()

    # These fields are temporary fileds and won't be save in the database
    username = serializers.SerializerMethodField(method_name='get_username')
    type = serializers.SerializerMethodField(method_name='get_type')
    postId = serializers.SerializerMethodField(method_name='get_postId')

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'longitude', 'latitude', 'categories', 'diet',
                'distance', 'username', 'type', 'postId', 'expiryDate']
        
    def get_username(self, obj):
        if(type(obj) == collections.OrderedDict): # on creation
            return None
        
        if (type(obj) == dict ):
             user = obj['postedBy']
        else:
            user = obj.postedBy

        return user.username
    
    def get_type(self, obj):
        return 'o'
    
    def get_postId(self, obj):
        if(type(obj) == collections.OrderedDict): # on creation
            return None

        if (type(obj) == dict):
            post = OfferPost.objects.get(title=obj['title'] ,postedOn=obj['postedOn'])
            return post.pk
        else:
            return obj.pk

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
                       longitude=self.validated_data['longitude'],
                       latitude=self.validated_data['latitude'],
                       categories=self.validated_data['categories'],
                       diet=self.validated_data['diet'],
                       expiryDate=self.validated_data['expiryDate'])
        post.save()