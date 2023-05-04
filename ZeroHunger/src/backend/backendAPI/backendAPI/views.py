from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib.auth import logout

from .managers import CustomUserManager
from .serializers import ResgistrationSerializer, LoginSerializer
class createUser(APIView):
    def post(self, request, format=None): #POST a new user to the database\
        
        serializer = ResgistrationSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response("ERROR, serializer isn't valid", status=401)
      
    
class deleteUser(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in deleteUser"})
    
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
        if request.user.is_authenticated():
            logout(request)
            return Response({"User logged out!", 200})
        else:
            return Response({"Invalid logout request, no authenticated user to log out", 401})


       
