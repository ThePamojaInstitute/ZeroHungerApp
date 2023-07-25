from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.core import serializers
from django.conf import settings
from django.db.models import Q


from django.http import JsonResponse
import uuid

import json
import jwt
import requests
import math

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
    
def get_posts(posts_type, page, sortBy, categories, diet, logistics, accessNeeds):
    try:
        if(posts_type == "r"):
            posts = RequestPost.objects.all().filter(fulfilled=False)
        else:
            posts = OfferPost.objects.all().filter(fulfilled=False)

        if(sortBy == "old"):
            posts = posts.order_by('postedOn')
        else:
            posts = posts.order_by('-postedOn')
            
        if(len(categories) > 0):
            categories.sort()
            str_categories = ",".join(x for x in categories)
            posts = posts.filter(categories__contains=str_categories)

        if(len(diet) > 0):
            diet.sort()
            str_diet = ",".join(x for x in diet)
            posts = posts.filter(diet__contains=str_diet)

        if(len(logistics) > 0):
            posts = posts.filter(logistics__contains=logistics)

        if(accessNeeds != 'a'):
            posts = posts.filter(accessNeeds=accessNeeds)

        return posts[page * 5:][:5]
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def serialize_posts(posts):
    data = serializers.serialize('json', posts)
    return json.loads(data)

def get_postal_code(user_id):
    user = BasicUser.objects.get(pk=user_id)
    return user.postalCode

def get_coordinates(postal_code):
    if len(postal_code) > 6:
        seperator = postal_code[3]
        postal_code = postal_code.replace(seperator, '')
    
    url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{postal_code}.json?access_token={settings.MAPBOX_ACCESS_CODE}'
    res = requests.get(url, headers={'User-Agent': "python-requests/2.31.0"}).json()

    longitude = res['features'][0]['center'][0] 
    latitude = res['features'][0]['center'][1] 
    coordinated = f'{longitude},{latitude}'

    return coordinated

def parse_coordinates(coord):
    coords = coord.split(',')

    lng = float(coords[0])
    lat = float(coords[1])

    return lng, lat

def get_distance(coord1, coord2):
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees)
    """
    lng1 = coord1[0]
    lat1 = coord1[1]
    lng2 = coord2[0]
    lat2 = coord2[1]

    # convert decimal degrees to radians 
    lng1, lat1, lng2, lat2 = map(math.radians, [lng1, lat1, lng2, lat2])

    # haversine formula 
    dlon = lng2 - lng1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles. Determines return value units.
    return c * r

def add_distance(user, data):
    try:
        if(len(user.coordinates) > 0):
                coord = user.coordinates
                user_coordinates = parse_coordinates(coord) 

                for post in data:
                    coordinates = post['fields']['coordinates']
                    if(len(coordinates) > 0):
                        coordinates = parse_coordinates(coordinates)
                        distance = get_distance(user_coordinates, coordinates)
                        post['fields']['distance'] = round(distance, 1)
    except Exception as e:
        return Response(e, status=500)

class createPost(APIView):
    def post(self, request, format=JSONParser):
        postal_code = request.data['postData']['postalCode']

        if(len(postal_code) == 0):
            user_id = request.data['postData']['postedBy']
            postal_code = get_postal_code(user_id)
            
        if(postal_code):
            request.data['postData']['coordinates'] = get_coordinates(postal_code)
        else:
            request.data['postData']['coordinates'] = ''

        if (request.data['postType'] == "r"): 
            serializer = createRequestSerializer(data=request.data['postData'])
        elif (request.data['postType'] == "o"):
            serializer = createOfferSerializer(data=request.data['postData'])

        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        
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
        user = ''
        try:
            decoded_token = decode_token(request.headers['Authorization'])
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except Exception:
            return Response("User not found", 404)

        page = int(request.GET.get('page',0))
        postsType = request.GET.get('postsType',"r")
        sortBy = request.GET.get('sortBy',"")
        categories = request.GET.getlist('categories[]',"")
        diet = request.GET.getlist('diet[]',"")
        logistics = request.GET.getlist('logistics[]',"")
        accessNeeds = request.GET.get('accessNeeds',"")

        posts = get_posts(postsType, page, sortBy, categories, diet, logistics, accessNeeds)

        data = serialize_posts(posts)

        add_username(data)
        add_distance(user, data)
        
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