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


def decode_token(auth_header):
    try:
        return jwt.decode(auth_header, settings.SECRET_KEY)
    except:
        return Response("Token invalid or not given", 401)
    
def add_username(posts):
    for post in posts:
                try:
                    user_id = post['fields']['postedBy'] 
                    try:   
                        user = BasicUser.objects.get(pk=user_id)
                        post.update({'username': user.username})
                    except:
                        posts.remove(post)
                        pass   
                except Exception as e:
                    return Response(e.__str__(), 500)
                
def get_posts(posts_type, order_by_newest, page, decoded_token):
    try:
        if(posts_type == "r"):
            if(order_by_newest == 'false'):
                posts = RequestPost.objects.filter(postedBy__pk=decoded_token['user_id']).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = RequestPost.objects.filter(postedBy__pk=decoded_token['user_id']).all().order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            if(order_by_newest == 'false'):
                posts = OfferPost.objects.filter(postedBy__pk=decoded_token['user_id']).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = OfferPost.objects.filter(postedBy__pk=decoded_token['user_id']).all().order_by('-postedOn')[page * 5:][:5]
        return posts
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def get_user_posts(data):
    try:
            if(data['data']['postType'] == "r"):
                return RequestPost.objects.get(pk=data['data']['postId'])
            elif(data['data']['postType'] == "o"):
                return OfferPost.objects.get(pk=data['data']['postId'])
    except:
        return Response("Post not found", 404)

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
        decoded_token = decode_token(request.headers['Authorization'])
        
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
            obj = RequestPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[counter:][:5]
        elif(request.data['postType'] == "o"):
            obj = OfferPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[counter:][:5]
        
        data = serializers.serialize('json', obj)
        data = json.loads(data)

        add_username(data)
        
        return Response(json.dumps(data), status=201)
     
     def get(self, request):
        length = {
            "r": len(RequestPost.objects.all()),
            "o": len(OfferPost.objects.all())
        }

        return Response(length, status=200)
     
class postsHistory(APIView):
    def get(self, request):
            decoded_token = decode_token(request.headers['Authorization'])
            
            postsType = request.GET.get('postsType','')
            orderByNewest = request.GET.get('orderByNewest','')
            page = int(request.GET.get('page',''))

            posts = get_posts(postsType, orderByNewest, page, decoded_token)

            data = serializers.serialize('json', posts)
            data = json.loads(data)

            add_username(data)

            return Response(data, status=200)

class markAsFulfilled(APIView):
     def put(self, request):
        decoded_token = decode_token(request.data['headers']['Authorization'])
        
        obj = get_user_posts(request.data)
        
        # if user is the owner of the post
        if(decoded_token['username'] == obj.postedBy.username):
            try:
                obj.fulfilled = True
                obj.save()

                return Response("Post updated successfully!", 200)
            except:
                return Response("Error while updating post", 500)
        else:
            return Response("Unauthorized", 401)