from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.conf import settings
from django.db.models import FloatField, ExpressionWrapper, F, When, Case, Value, Q
from django.db.models.lookups import Exact
from django.db.models.functions import Cos, Sin, Sqrt, Radians, ASin, Round, Power
from .models import OfferPost, RequestPost
from .serializers import createOfferSerializer, createRequestSerializer
from apps.Users.models import BasicUser
from datetime import datetime
from apps.Posts.choices import LOGISTICS_CHOICES, DIET_PREFERENCES, FOOD_CATEGORIES

import uuid
import jwt
import requests
import os
import base64

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobClient, generate_account_sas, ResourceTypes, AccountSasPermissions, ContainerClient

keyVaultName = os.environ["KEYVAULT_NAME"]
vaultURI = f"https://{keyVaultName}.vault.azure.net"
#credential = DefaultAzureCredential( managed_identity_client_id = os.environ["MANAGED_ID"] )
credential = DefaultAzureCredential()
client = SecretClient(vault_url=vaultURI, credential=credential)
connection_string = client.get_secret("BLOB-CONNECTION-STRING").value


#https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=npm
#Install Azurite on your local machine using this ^ guide before trying to use this

    
def create_filter(field, choices, type):
    field_filter = Q()

    for choice in choices:
        if(choice[0] in field):
            if(type == 'logistics'):
                field_filter &= Q( logistics__contains=choice[0] )
            elif(type == 'diet'):
                field_filter &= Q( diet__contains=choice[0] )
            elif(type == 'categories'):
                field_filter &= Q( categories__contains=choice[0] )

    return field_filter

def get_user_posts(posts_type, order_by_newest, page, user_id):
    try:
        if(posts_type == "r"):
            if(order_by_newest == 'false'):
                posts = RequestPost.objects.filter(
                    postedBy__pk=user_id, expiryDate__gte=datetime.now()
                    ).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = RequestPost.objects.filter(
                    postedBy__pk=user_id, expiryDate__gte=datetime.now()
                    ).all().order_by('-postedOn')[page * 5:][:5]
        elif(posts_type == "o"):
            if(order_by_newest == 'false'):
                posts = OfferPost.objects.filter(
                    postedBy__pk=user_id, expiryDate__gte=datetime.now()
                    ).all().order_by('postedOn')[page * 5:][:5]
            else:
                posts = OfferPost.objects.filter(
                    postedBy__pk=user_id, expiryDate__gte=datetime.now()
                    ).all().order_by('-postedOn')[page * 5:][:5]
        
        posts = posts.annotate(distance=Value(0.0, output_field=FloatField()))

        return posts
    except Exception as e:
        print(e)
        return Response(e.__str__(), 500) 
    
def get_post(post_id, post_type):
    try:
            if(post_type == "r"):
                return RequestPost.objects.get(pk=post_id)
            elif(post_type == "o"):
                return OfferPost.objects.get(pk=post_id)
    except:
        return Response("Post not found", 404)
    
def get_filtered_posts(posts_type, categories, diet, logistics, distance, searchQuery, user):
    try:
        if(posts_type == "r"):
            posts = RequestPost.objects.all().filter(fulfilled=False, expiryDate__gte=datetime.now(), title__icontains=searchQuery)
        else:
            posts = OfferPost.objects.all().filter(fulfilled=False, expiryDate__gte=datetime.now(), title__icontains=searchQuery)

        if(len(categories) > 0):
            categories_filter = create_filter(categories, FOOD_CATEGORIES, 'categories')
            posts = posts.filter(categories_filter)

        if(len(diet) > 0):
            diet_filter = create_filter(diet, DIET_PREFERENCES, 'diet')
            posts = posts.filter(diet_filter)

        if(len(logistics) > 0):
            logistics_filter = create_filter(logistics, LOGISTICS_CHOICES, 'logistics')
            posts = posts.filter(logistics_filter)

        lat1 = user.latitude
        lng1 = user.longitude

        # this adds a "distance" pseudo field to the queryset by calculating the distance for each object
        # all of this happens in a single sql query which would be drastically faster that iterating through the posts objects 
        posts = posts.all().annotate(distance=Case(
            When(Exact(F('postedBy'), user.pk), then=None), # if this user is the owner of the post return None
            default=ExpressionWrapper( # this equation uses Haversine formula to calculate the distance between two points
            Round(((2 * ASin(Sqrt((Power(Sin((Radians(F('latitude')) - Radians(lat1))/2), 2)
                + Cos(Radians(lat1)) * Cos(Radians(F('latitude')))
                * Power(Sin((Radians(F('longitude')) - Radians(lng1)) /2), 2))))) * 6371), 5),
            output_field=FloatField())
        ))

        if(distance > 0 and len(user.postalCode) > 0):
            posts = posts.filter((~Q(postedBy=user) & Q(distance__lte=distance)) | Q(postedBy=user))
        # else: 
        #     posts = posts.exclude(postedBy=user)

        return posts
    except Exception as e:
        print(e)
        return Response(e.__str__(), 500) 
    
def sort_posts(posts, sortBy, page):
    try:
        if(sortBy == "distance"):
            posts = posts.all().order_by(F('distance').asc(nulls_last=True))
        elif(sortBy == "old"):
            posts = posts.all().order_by('postedOn')
        else:
            posts = posts.all().order_by('-postedOn')

        return posts[page * 5:][:5]
    except Exception as e:
        return Response(e.__str__(), 500) 
    
def serialize_posts(posts, postsType):
    try:
        if(postsType == "r"):
            serializer = createRequestSerializer(posts, many=True)
        else:
            serializer = createOfferSerializer(posts, many=True)
                                               
        return serializer
    except Exception as e:
        print(e)
        return Response(e.__str__(), 500) 
        
def get_postal_code(user_id):
    user = BasicUser.objects.get(pk=user_id)
    return user.postalCode

def get_coordinates(postal_code):
    try:
        if len(postal_code) > 6:
            seperator = postal_code[3]
            postal_code = postal_code.replace(seperator, '')
        
        url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{postal_code}.json?access_token={settings.MAPBOX_ACCESS_CODE}'
        res = requests.get(url, headers={'User-Agent': "python-requests/2.31.0"}).json()

        if(len(res['features']) == 0):
            return 'invalid', 'invalid'

        longitude = res['features'][0]['center'][0] 
        latitude = res['features'][0]['center'][1] 

        return longitude, latitude
    except Exception as e:
        return Response(e.__str__(), 500) 

class createPost(APIView):
    def post(self, request, format=JSONParser):
        postal_code = request.data['postData']['postalCode']

        if(len(postal_code) == 0):
            user_id = request.data['postData']['postedBy']
            postal_code = get_postal_code(user_id)
            
        if(postal_code):
            lon, lat = get_coordinates(postal_code)

            if(lon == "invalid"):
                return Response("invalid postal code", status=400)

            request.data['postData']['longitude'] = float(lon)
            request.data['postData']['latitude'] = float(lat)
        else:
            request.data['postData']['longitude'] = None
            request.data['postData']['latitude'] = None

        if (request.data['postType'] == "r"): 
            serializer = createRequestSerializer(data=request.data['postData'])
        elif (request.data['postType'] == "o"):
            serializer = createOfferSerializer(data=request.data['postData'])

        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        
class deletePost(APIView):
     def delete(self,request, format=JSONParser):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
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
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except Exception:
            return Response("User not found", 404)

        try:
            page = int(request.GET.get('page',0))
            postsType = request.GET.get('postsType',"r")
            sortBy = request.GET.get('sortBy',"")
            categories = request.GET.getlist('categories[]',"")
            diet = request.GET.getlist('diet[]',"")
            logistics = request.GET.getlist('logistics[]',"")
            distance = request.GET.get('distance',15)
            searchQuery = request.GET.get('searchQuery', "")
        except Exception as e:
            return Response(e.__str__(), 400) 

        try:
            posts = get_filtered_posts(postsType, categories, diet, logistics, int(distance), searchQuery, user)
            posts = sort_posts(posts, sortBy, page)
        except Exception as e:
            return Response(e.__str__(), 500) 

        try:
            serializer = serialize_posts(posts, postsType)
        except Exception as e:
            print(e)
            return Response("Error while serializing posts", 500) 

        return Response(serializer.data, status=201)
     
class postsHistory(APIView):
    def get(self, request):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)

        try:
            postsType = request.GET.get('postsType',"r")
            orderByNewest = request.GET.get('orderByNewest',True)
            page = int(request.GET.get('page',0))
        except Exception as e:
            return Response(e.__str__(), 400) 

        try:
            posts = get_user_posts(postsType, orderByNewest, page, decoded_token['user_id'])
            serializer = serialize_posts(posts, postsType)
        except Exception as e:
            return Response(e.__str__(), 500) 
        
        return Response(serializer.data, status=200)

class markAsFulfilled(APIView):
    def put(self, request):
        try:
            decoded_token =  jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
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

            
            #connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
            container_client = ContainerClient.from_connection_string(conn_str=connection_string, container_name="post-images")
            if not container_client.exists():
                container_client.create_container()
            blob_service_client = BlobClient.from_connection_string(conn_str=connection_string, container_name="post-images", blob_name=(file_upload_name))
            imageInBase64 = request.data['IMAGE']
            blob_service_client.upload_blob(base64.decodebytes(bytes(imageInBase64, 'utf-8')))
            print(blob_service_client.url)
            return Response(blob_service_client.url, status=201) 
         except Exception as ex:
             return Response(str(ex), status=500)


# Temporary view till the redis server and Celery are setup
class deleteExpiredPosts(APIView):
    def post(self, request):
        today = datetime.now().date()

        try:
            RequestPost.objects.filter(expiryDate__date=today).delete()
            OfferPost.objects.filter(expiryDate__date=today).delete()
            
            return Response(status=204)
        except Exception as e:
            print(e)
            return Response(e, status=500)
        
class extendPostExpiryDate(APIView):
    def put(self, request):
        try:
            decoded_token =  jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except:
            return Response("Token invalid or not given", 401)

        try:
            post_type = request.data['data']['postType']
            post_id =  int(request.data['data']['postId'])
            new_expiry_date =  request.data['data']['newExpiryDate']
        except Exception as e:
            print(e)
            return Response(e, status=400)
        
        try:
            if(post_type == "r"):
                post = RequestPost.objects.get(pk=post_id)
            else:
                post = OfferPost.objects.get(pk=post_id)
        except Exception as e:
            print(e)
            return Response("Post not found", 404)
        
        if(post.postedBy != user):
            return Response("User is not the owner of the post", 401)
        
        try:
            post.expiryDate = new_expiry_date
            post.save()
        except Exception as e:
            print(e)
            return Response("Error while updating post expiry date", 500)
        
        return Response(status=204)
        