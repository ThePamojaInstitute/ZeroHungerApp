from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.core import serializers
from django.conf import settings

import json
import jwt

from .models import OfferPost, RequestPost
from .serializers import createOfferSerializer, createRequestSerializer
from apps.Users.models import BasicUser


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
     def delete(self,request, format=JSONParser):
        try:
            decoded_token = jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            if(request.data['postType'] == "r"):
                obj = RequestPost.objects.get(pk=request.data['postId'])
            elif(request.data['postType'] == "o"):
                obj = OfferPost.objects.get(pk=request.data['postId'])
        except:
            return Response("Post not found", 404)
        
        # if user is the owner of the post
        if(decoded_token['username'] == obj.postedBy.username):
            try:
                obj.delete()

                return Response("Post deleted successfully!", 200)
            except:
                return Response("Error while deleting post", 500)
        else:
            return Response("Unauthorized", 401)
            
#https://stackoverflow.com/questions/57031455/infinite-scrolling-using-django
class requestPostsForFeed(APIView):
     def post(self, request):
        response_data = request.data
        response_data = json.dumps(response_data)
        data = json.loads(response_data)
        counter = int(data['postIndex'])

        if(request.data['postType'] == "r"):
            obj = RequestPost.objects.all()[counter:][:5]
        elif(request.data['postType'] == "o"):
            obj = OfferPost.objects.all()[counter:][:5]
        
        data = serializers.serialize('json', obj)
        data = json.loads(data)

        for post in data:
            try:
                user_id = post['fields']['postedBy'] 
                try:   
                    user = BasicUser.objects.get(pk=user_id)
                    post.update({'username': user.username})
                except:
                    data.remove(post)
                    pass   
            except Exception as err:
                return Response(err.__str__(), 500)
        
        return Response(json.dumps(data), status=201)
     
     def get(self, request):
        length = {
            "r": len(RequestPost.objects.all()),
            "o": len(OfferPost.objects.all())
        }

        return Response(length, status=200)
