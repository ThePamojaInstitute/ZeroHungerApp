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
            container_client = ContainerClient.from_connection_string(conn_str=connection_string, container_name=file_upload_name)
            container_client.create_container()
            blob_service_client = BlobClient.from_connection_string(conn_str=connection_string, container_name="testcontainer", blob_name=(file_upload_name))
            imageInBase64 = request.data['IMAGE']
            blob_service_client.upload_blob(base64.decodebytes(bytes(imageInBase64, 'utf-8')))
            print(blob_service_client.url)
            return Response(blob_service_client.url, status=201) 
         except Exception as ex:
             return Response(str(ex), status=401)

#  