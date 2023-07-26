from rest_framework import serializers, fields
from .models import RequestPost, OfferPost
from .choices import LOGISTICS_CHOICES, ACCESS_NEEDS_CHOICES, FOOD_CATEGORIES, DIET_PREFERENCES
from apps.Users.models import BasicUser
from django.db import models
from datetime import datetime 
import math


def parse_coordinates(coord):
    coords = coord.split(',')

    lng = float(coords[0])
    lat = float(coords[1])

    return lng, lat

def calculate_distance(coord1, coord2):
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees)
    """
    lng1 = coord1[0]
    lat1 = coord1[1]
    lng2 = coord2[0]
    lat2 = coord2[1]

    # convert decimal degrees to radians 
    lng1, lat1, lng2, lat2 = map(math.radians, [lng1, lat1, lng2, lat2])

    # haversine formula 
    dlon = lng2 - lng1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles. Determines return value units.
    return c * r

def get_distance(user_id, postedBy, obj):
    if(user_id != postedBy.pk):
            user = BasicUser.objects.get(pk=user_id)
            coord = user.coordinates
            user_coordinates = parse_coordinates(coord) 

            if(obj.coordinates):
                coordinates = parse_coordinates(obj.coordinates)
                distance = calculate_distance(user_coordinates, coordinates)
                return round(distance, 1)
    else:
        return None


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
    accessNeeds = serializers.CharField(max_length=1)
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)

    # These fields are temporary fileds and won't be save in the database
    distance = serializers.SerializerMethodField(method_name='get_distance')
    username = serializers.SerializerMethodField(method_name='get_username')
    type = serializers.SerializerMethodField(method_name='get_type')
    postId = serializers.SerializerMethodField(method_name='get_postId')

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates', 'categories', 'diet',
                'distance', 'username', 'type', 'postId']
        
    def get_distance(self, obj):
        user_id = self.context.get("user_id")
        distance = get_distance(user_id, obj.postedBy, obj)
        return distance

    def get_username(self, obj):
        user = obj.postedBy
        return user.username
    
    def get_type(self, obj):
        return 'r'
    
    def get_postId(self, obj):
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
    accessNeeds = serializers.CharField(max_length=1)
    categories = fields.MultipleChoiceField(choices=FOOD_CATEGORIES, required=False)
    diet = fields.MultipleChoiceField(choices=DIET_PREFERENCES, required=False)

    # These fields are temporary fileds and won't be save in the database
    distance = serializers.SerializerMethodField(method_name='get_distance')
    username = serializers.SerializerMethodField(method_name='get_username')
    type = serializers.SerializerMethodField(method_name='get_type')
    postId = serializers.SerializerMethodField(method_name='get_postId')

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                'description', 'fulfilled', 'logistics', 'postalCode',
                'accessNeeds', 'coordinates', 'categories', 'diet',
                'distance', 'username', 'type', 'postId']
        
    def get_distance(self, obj):
        user_id = self.context.get("user_id")
        return get_distance(user_id, obj.postedBy, obj)

    def get_username(self, obj):
        user = obj.postedBy
        return user.username
    
    def get_type(self, obj):
        return 'o'
    
    def get_postId(self, obj):
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
                       coordinates=self.validated_data['coordinates'],
                       categories=self.validated_data['categories'],
                       diet=self.validated_data['diet'],)
        post.save()