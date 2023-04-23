from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from .managers import CustomUserManager
from .serializers import ResgistrationSerializer
class createUser(APIView):
    def post(self, request, format=None): #POST a new user to the database\
        
        serializer = ResgistrationSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response("ERROR", status=401)
    

        CustomUserManager.create_user()
        return Response({"You made it to POST in createUser"}, status= 202)
    
class deleteUser(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in deleteUser"})
    
class modifyUser(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in modifyUser"})
    
class logIn(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in logIn"})
    
class logOut(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in logOut"})
