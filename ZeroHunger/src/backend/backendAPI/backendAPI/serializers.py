from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.response import Response
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

class LoginSerializer (serializers.ModelSerializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=50, write_only=True)
    class Meta:
        model=BasicUser
        fields = ['username', 'password']
    def logIn(self):
        username = self.validated_data['username']
        password = self.validated_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            return Response(user.__str__(), status=201)
        else:
            return Response("ERROR", status=401)
