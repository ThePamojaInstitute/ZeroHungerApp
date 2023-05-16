from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.conf import settings

from .models import BasicUser
from .managers import CustomUserManager
from .serializers import ResgistrationSerializer, LoginSerializer
import jwt

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class createUser(APIView):
    def post(self, request, format=None): #POST a new user to the database\
        serializer = ResgistrationSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
            send_mail(
            "Zero Hunger Project - New User",
            "Welcome to the zero hunger project!",
            "noahglassford@gmail.com",
            ["noah@pamojainstitute.org"],
             fail_silently=False,
            )
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=401)
      
    
class deleteUser(APIView):
    def delete(self,request, format=None):
        try:
            decoded_token = jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response(status=401)

        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
            user.delete()

            return Response({"User deleted"}, 200)
        except:
            return Response(status=204)
    
class modifyUser(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in modifyUser"})
    
class logIn(APIView):
    def post(self,request, format=None):
         
        serializer = LoginSerializer(data=request.data)
        if (serializer.is_valid()):
            return serializer.logIn()
        else:
            return Response({"Error logging in", 401})
        
        
class logOut(APIView):
    def post(self,request, format=None):
        permission_classes = (IsAuthenticated)
        try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=205)
        except Exception as e:
           return Response(status=400)


       
