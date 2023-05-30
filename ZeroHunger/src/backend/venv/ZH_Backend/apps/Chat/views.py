from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

# Create your views here.
class testChatAPI(APIView):
     def post(self,request, format=JSONParser):
          print("Chat API test")
          return Response("Reached the Chat API Test", status=201)
