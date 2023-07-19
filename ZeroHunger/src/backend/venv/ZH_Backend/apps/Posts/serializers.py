from rest_framework import serializers, fields
from .models import RequestPost, OfferPost, logistics_choices
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
    logistics = fields.MultipleChoiceField(choices=logistics_choices, required=False)

    class Meta:
        model=RequestPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                  'description', 'fulfilled', 'logistics']
    def save(self):
        post=RequestPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'],
                       fulfilled=self.validated_data['fulfilled'],
                       logistics=self.validated_data['logistics'])
        post.save()

class createOfferSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256, required=False, allow_blank=True)
    postedOn = serializers.DateTimeField(default=datetime.now)
    postedBy = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
    description = serializers.CharField(max_length=1024, required=False, allow_blank=True)
    fulfilled = serializers.BooleanField(default=False)
    logistics = fields.MultipleChoiceField(choices=logistics_choices, required=False)

    class Meta:
        model=OfferPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                  'description', 'fulfilled', 'logistics']
    def save(self):
        post=OfferPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'],
                       fulfilled=self.validated_data['fulfilled'],
                       logistics=self.validated_data['logistics'])
        post.save()