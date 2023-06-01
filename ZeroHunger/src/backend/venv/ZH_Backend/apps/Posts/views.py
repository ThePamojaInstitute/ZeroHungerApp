from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from django.core import serializers

import json
import sys

from .models import BoardPost
from .serializers import createPostSerializer


class createPost(APIView):
    def post(self, request, format=JSONParser):
        serializer = createPostSerializer(data=request.data)
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
        print("Request Posts Test")
        response_data = request.data
        response_data = json.dumps(response_data)
        data = json.loads(response_data)
        counter = int(data['counter'])
        obj = BoardPost.objects.all()[counter:][:2]
        data = serializers.serialize('json', obj)
       # outdata = { 'data':data }
        return Response(data, status=201)
