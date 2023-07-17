from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.core import serializers
from django.conf import settings


from django.http import JsonResponse
import uuid

import json
import jwt

from .models import OfferPost, RequestPost
from .serializers import createOfferSerializer, createRequestSerializer
from apps.Users.models import BasicUser
from datetime import datetime, timedelta
import os
import base64
from azure.identity import EnvironmentCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobClient, generate_account_sas, ResourceTypes, AccountSasPermissions, ContainerClient
#VAULT_URL = os.environ["VAULT_URL"]
#envcredential = EnvironmentCredential()
#client = SecretClient(vault_url=VAULT_URL, credential=envcredential)
connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
#https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=npm
#Install Azurite on your local machine using this ^ guide before trying to use this


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
                
def get_user_posts(posts_type, order_by_newest, page, user_id):
    try:
        if(posts_type == "r"):
            if(order_by_newest == 'false'):
                posts = RequestPost.objects.filter(postedBy__pk=user_id).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = RequestPost.objects.filter(postedBy__pk=user_id).all().order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            if(order_by_newest == 'false'):
                posts = OfferPost.objects.filter(postedBy__pk=user_id).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = OfferPost.objects.filter(postedBy__pk=user_id).all().order_by('-postedOn')[page * 5:][:5]
        return posts
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def get_post(post_id, post_type):
    try:
            if(post_type == "r"):
                return RequestPost.objects.get(pk=post_id)
            elif(post_type == "o"):
                return OfferPost.objects.get(pk=post_id)
    except:
        return Response("Post not found", 404)
    
def get_posts(posts_type, page):
    try:
        if(posts_type == "r"):
            return RequestPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            return OfferPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[page * 5:][:5]
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def serialize_posts(posts):
    data = serializers.serialize('json', posts)
    return json.loads(data)

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
                
def get_user_posts(posts_type, order_by_newest, page, user_id):
    try:
        if(posts_type == "r"):
            if(order_by_newest == 'false'):
                posts = RequestPost.objects.filter(postedBy__pk=user_id).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = RequestPost.objects.filter(postedBy__pk=user_id).all().order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            if(order_by_newest == 'false'):
                posts = OfferPost.objects.filter(postedBy__pk=user_id).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = OfferPost.objects.filter(postedBy__pk=user_id).all().order_by('-postedOn')[page * 5:][:5]
        return posts
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def get_post(post_id, post_type):
    try:
            if(post_type == "r"):
                return RequestPost.objects.get(pk=post_id)
            elif(post_type == "o"):
                return OfferPost.objects.get(pk=post_id)
    except:
        return Response("Post not found", 404)
    
def get_posts(posts_type, page):
    try:
        if(posts_type == "r"):
            return RequestPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            return OfferPost.objects.all().filter(fulfilled=False).order_by('-postedOn')[page * 5:][:5]
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def serialize_posts(posts):
    data = serializers.serialize('json', posts)
    return json.loads(data)


class createPost(APIView):
    def post(self, request, format=JSONParser):
        print(request.data)
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
        
        post = get_post(request.data['postId'], request.data['postType'])
        
        # if user is the owner of the post
        if(decoded_token['username'] == post.postedBy.username):
            try:
                post.delete()

                return Response("Post deleted successfully!", 200)
            except:
                return Response("Error while deleting post", 500)
        else:
            return Response("Unauthorized", 401)
            
#https://stackoverflow.com/questions/57031455/infinite-scrolling-using-django
class requestPostsForFeed(APIView):
    def get(self, request):
        page = int(request.GET.get('page',0))
        postsType = request.GET.get('postsType',"r")

        posts = get_posts(postsType, page)

        data = serialize_posts(posts)

        add_username(data)
        
        return Response(data, status=201)
     
class postsHistory(APIView):
    def get(self, request):
        decoded_token = decode_token(request.headers['Authorization'])
            
        postsType = request.GET.get('postsType',"r")
        orderByNewest = request.GET.get('orderByNewest',True)
        page = int(request.GET.get('page',0))

        posts = get_user_posts(postsType, orderByNewest, page, decoded_token['user_id'])

        data = serialize_posts(posts)

        add_username(data)

        return Response(data, status=200)

class markAsFulfilled(APIView):
    def put(self, request):
        decoded_token = decode_token(request.data['headers']['Authorization'])
        
        obj = get_post(request.data['data']['postId'], request.data['data']['postType'])
        
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
class ImageUploader(APIView):
  
     def post(self,request):
         try:
            local_path = "./data"
            local_file_name = "android_scrollup.png"
            upload_file_path = os.path.join(local_path, local_file_name)
            file = open(file=upload_file_path, mode='r')
            file_upload_name = str(uuid.uuid4())

            # sas_token = generate_account_sas(
            # account_name="devstoreaccount1",                                                                        #These keys need to be replaced with azure keyvault for production
            # account_key="Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==>", #these are the already well-known azurite keys, do not need to be hidden
            # resource_types=ResourceTypes(service=True),
            # permission=AccountSasPermissions(read=True),
            # expiry=datetime.utcnow() + timedelta(hours=1)
            # )

            connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
            container_client = ContainerClient.from_connection_string(conn_str=connection_string, container_name="post-images")
            if not container_client.exists():
                container_client.create_container()
            blob_service_client = BlobClient.from_connection_string(conn_str=connection_string, container_name="post-images", blob_name=(file_upload_name))
            imageInBase64 = request.data['IMAGE']
            blob_service_client.upload_blob(base64.decodebytes(bytes(imageInBase64, 'utf-8')))
            print(blob_service_client.url)
            return Response(blob_service_client.url, status=201) 
         except Exception as ex:
             return Response(str(ex), status=401)

#  