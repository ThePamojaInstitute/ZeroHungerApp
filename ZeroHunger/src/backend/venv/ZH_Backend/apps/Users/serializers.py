from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.db import models
from .models import BasicUser, UserSurveyResponse
from .models import BasicUser
import pprint

class RegistrationSerializer (serializers.ModelSerializer):
    username = serializers.CharField( validators=[UniqueValidator(queryset=BasicUser.objects.all(), message="Username is taken")],max_length=64)
    email = serializers.EmailField( max_length=256, validators=[UniqueValidator(queryset=BasicUser.objects.all(),  message="There is already an account associated with this email")])
    password = serializers.CharField(max_length=64, write_only=True) 

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
    username = serializers.CharField(max_length=64)
    password = serializers.CharField(max_length=64, write_only=True)
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

# class AccountSettingsSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(max_length=64)
#     email = serializers.EmailField( max_length=256)
#     password = serializers.CharField(max_length=64, write_only=True)
#     class Meta:
#         model=BasicUser
#         fields = ['username','email','password']
#     def editUser(self):
#         user=BasicUser(username="test")
#         user.save()

class UpdateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[UniqueValidator(queryset=BasicUser.objects.all(), message="Username is taken")], required=False, max_length=64, read_only=False)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=BasicUser.objects.all(),  message="There is already an account associated with this email")], required=False, read_only=False)
    class Meta:
        model = BasicUser
        fields = ['username', 'email']

    # def validate_email(self, value):
    #     user = self.context['request'].user
    #     if BasicUser.objects.exclude(pk=user.pk).filter(email=value).exists():
    #         raise serializers.ValidationError({"email": "This email is already in use."})
    #     return value

    # def validate_username(self, value):
    #     user = self.context['request'].user
    #     if BasicUser.objects.exclude(pk=user.pk).filter(username=value).exists():
    #         raise serializers.ValidationError({"username": "This username is already in use."})
    #     return value

            # if BasicUser.objects.exclude(instance.pk).filter(username=usernameFromRequest).exists():
        #     print ("Username is already in use")
        # if BasicUser.objects.exclude(instance.pk).filter(email=emailFromRequest).exists():
        #     print ("Email is already in use")
        

    def update(self, instance):
        #manually validate data
        usernameFromRequest = self.initial_data['data']['user']['username']
        emailFromRequest = self.initial_data['data']['user']['email']
        instance.email = emailFromRequest
        instance.username = usernameFromRequest
        instance.save()
        return instance
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicUser
        fields = ["username"]


class SurveySerializer(serializers.ModelSerializer):
    stillInteractsOutsideApp = serializers.BooleanField(required=False)
    responseBy = serializers.models.IntegerField( blank=True )
    def save(self):
        firstAnswerFromRequest = self.initial_data['surveyData']['stillInteractsOutsideApp']
        responseUserID = self.initial_data['surveyData']['responseBy']
        surveyresult=UserSurveyResponse(stillInteractsOutsideApp=firstAnswerFromRequest , responseBy = responseUserID)
        surveyresult.save()
    class Meta:
        model = UserSurveyResponse
        fields = ["stillInteractsOutsideApp", "responseBy"]

