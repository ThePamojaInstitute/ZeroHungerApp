from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

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
            user_serializer.save()
            return Response({"User":user_serializer.data}, status= 202)
        
        return Response({"msg":"ERR"}, status= 400)
    
    def delete(self, request, format=None):
        print("deleting user")
        #TODO: Implement delete user function
        return Response("Deleted user", status = 202)
    
    def put(self, request, format=None):
        print("Modifying User")
        return Response("Modified User", status = 202)
    
class AuthenticationView(APIView):
    def get(self, request, format=None): #get will return with authentication token/succesful or not
        #Function implementation here
        return Response("Login", status = 203)
    
    def head(self, request, format = None): #This just sends to the server, HEAD method doesn't return anything to front end
        #Function implementation here
        return Response("Logout", status = 203)
    