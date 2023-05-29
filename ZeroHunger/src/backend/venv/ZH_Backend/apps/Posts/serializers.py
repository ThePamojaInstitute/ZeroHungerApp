from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from rest_framework.response import Response
from .models import BoardPost

class createPostSerializer (serializers.ModelSerializer):
    title = serializers.CharField(max_length=128)
    images = serializers.CharField(max_length=256)
    postedOn = serializers.IntegerField(min_value = 1, max_value= 2147483647) #Checks the time value is within 32 bit integer limit and is not negative
    postedBy = serializers.IntegerField() #User ID
    description = serializers.CharField(max_length=1024)
    postType = serializers.CharField(max_length=1)

    class Meta:
        model=BoardPost
        fields = ['title', 'images', 'postedOn', 'postedBy', 
                  'description', 'postType']
    def save(self):
        post=BoardPost(title=self.validated_data['title'],
                       images=self.validated_data['images'],
                       postedOn=self.validated_data['postedOn'],
                       postedBy=self.validated_data['postedBy'],
                       description=self.validated_data['description'],
                       postType=self.validated_data['postType'])
        post.save()