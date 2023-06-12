from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.core import serializers

import json

from .models import OfferPost, RequestPost
from .serializers import createOfferSerializer, createRequestSerializer


class createPost(APIView):
    def post(self, request, format=JSONParser):
        if (request.data['postType'] == "r"): 
            serializer = createRequestSerializer(data=request.data['postData'])
        elif (request.data['postType'] == "o"):
            serializer = createOfferSerializer(data=request.data['postData'])

        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
              return Response(serializer.errors, status=401)
        
class deletePost(APIView):
     def post(self,request, format=JSONParser):
          print("delete post test")
          return Response("Reached delete post in API", status=201)
     

#https://stackoverflow.com/questions/57031455/infinite-scrolling-using-django
class requestPostsForFeed(APIView):
     def post(self, request):
        response_data = request.data
        response_data = json.dumps(response_data)
        data = json.loads(response_data)
        counter = int(data['postIndex'])

        if(request.data['postType'] == "r"):
            obj = RequestPost.objects.all()[counter:][:2]
        elif(request.data['postType'] == "o"):
            obj = OfferPost.objects.all()[counter:][:2]

        data = serializers.serialize('json', obj)
        return Response(data, status=201)
