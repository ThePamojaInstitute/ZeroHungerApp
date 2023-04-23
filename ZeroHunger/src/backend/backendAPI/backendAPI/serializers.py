from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from .models import BasicUser

class ResgistrationSerializer (serializers.ModelSerializer):
    username = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=50, write_only=True)

    class Meta: 
        model=BasicUser
        fields = ['username', 'email', 'password']
    
    def save(self):
        user=BasicUser(username=self.validated_data['username'],
                       email=self.validated_data['email'],
                       password=self.validated_data['password'])
        user.set_password(self.validated_data['password'])
        user.save()

        
