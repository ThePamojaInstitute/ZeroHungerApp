from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User

from .serializers import UserSerializer

class TestView(APIView):
    def get (self, request, format=None):
        print("API Get")
        return Response("Made it to get", status=201)
    
    def post(self, request, format=None):
        print("API Post")
        return Response("Made it to post", status=201)
    
class ModifyUsersView(APIView):

    def post(self, request, format=None): #POST a new user to the database
        
        print("Creating a User")
        user_data = request.data

        user_serializer = UserSerializer(data=user_data)
        
        if user_serializer.is_valid(raise_exception=False):
            user = user_serializer.save()
            
            return Response({"User":user_serializer.data}, status= 202)
        return Response({"msg":"Error!"}, status= 400)
    
    def delete(self, request, format=None):
        print("trying to delete user")
        try:
            usernamestring = request.body
            
            print(usernamestring)
        except:
            return Response("Error", status=400)

        return Response("Deleted user", status = 202)
    
    def put(self, request, format=None):
        print("Modifying User")
        #TODO: Implement modifying the user
        return Response("Modified User", status = 202)
    
class AuthenticationView(APIView):
    def get(self, request, format=None): #get will return with authentication token/succesful or not
        #Function implementation here
        return Response("Login", status = 203)
    
    def head(self, request, format = None): #This just sends to the server, HEAD method doesn't return anything to front end
        #Function implementation here
        return Response("Logout", status = 203)
    