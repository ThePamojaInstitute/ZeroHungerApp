from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer

class TestView(APIView):
    def get (self, request, format=None):
        print("API Was Called!")
        return Response("You Made It", status=201)
    
class UserView(APIView):
    def post(self, request, format=None):
        print("Creating a User")
        user_data = request.data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=False):
            user_serializer.save()
            return Response({"User":user_serializer.data}, status= 200)
        
        return Response({"msg":"ERR"}, status= 400)
    
    def get(self, request, format=None):
        if request.user.is_authenticated == False:
            return Response("Cannot Authenticate", status = 403)
        if request.user.is_active == False:
             return Response("User Inactive", status = 403)
        
        user = UserSerializer(request.user)
        print(user.data)
        return Response("TESTING", status=200)