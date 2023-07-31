from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

import json
import time

from .models import BasicUser
from apps.Chat.models import Conversation
from django.db.models import Q
from .serializers import RegistrationSerializer, LoginSerializer, UpdateUserSerializer
from .forms import EditProfileForm
from apps.Posts.views import decode_token

import jwt

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class createUser(APIView):
    def post(self, request, format=None): #POST a new user to the database\
        serializer = RegistrationSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
           # send_mail(
            #"Zero Hunger Project - New User",
            #"Welcome to the zero hunger project!",
            #"noahglassford@gmail.com",
            #["noah@pamojainstitute.org"],
            # fail_silently=False, 
            #)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=401)
        

class edit_account_view(APIView):
    def put(self, request, format=None):    
        try:
            decoded_token = jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("failed to authorize editing user", status=401)
        try:
            user_id = decoded_token['user_id']
           

            user = BasicUser.objects.get(pk=user_id)
           # print(user)
            serializer = UpdateUserSerializer(data=request.data)

            if (serializer.is_valid(raise_exception=True)):
                print ("data validated")
                serializer.update(instance=user)
                return Response("Modified Used", status=201)
            else:
                print(serializer.errors)
                return Response("Did not modify user", status = 403)
        except Exception as e:
             print("exception" + str(e))
             return Response(str(e), status=400)


            # print(request.data)
            # form = EditProfileForm(request.data, instance=user)
            # print(form)

            # if form.is_valid():
            #     form.save()
            #     return Response(status=200)
            # else:
            #     form = EditProfileForm(request.data, instance=user, initial= {"email":"test@testtest.com","username":"testuser"})
            #     if form.is_valid():
            #         form.save()
            #     else:
            #         return Response(status=400)

    

        
      
    
class deleteUser(APIView):
    def delete(self,request, format=None):
        try:
            decoded_token = jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
            print(decoded_token)
        except:
            return Response(status=401)

        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
            username = user.username
            user.delete()

            try:
                Conversation.objects.filter(
                    (Q(name__startswith=f"{username}__") | 
                    Q(name__endswith=f"__{username}"))).delete()
            except Exception as e:
                print(e)
                return Response({"Error while deleting conversations"}, 500)
            
            return Response({"User deleted"}, 200)
        except:
            return Response(status=204)
    
class logIn(APIView):
    def post(self,request, format=None):
         
        serializer = LoginSerializer(data=request.data)
        if (serializer.is_valid()):
            try:
                user = BasicUser.objects.get(username=request.data['username'])
                user.set_expo_push_token(request.data['expo_push_token'])
                user.save()
            except Exception as e:
                print(e)
                pass
            return serializer.logIn()
        else:
            return Response({"Error logging in", 401})
                
class logOut(APIView):
    def post(self,request, format=None):
        try:
               refresh_token = request.data["refresh_token"]
               
               try:  
                    decoded_user = jwt.decode(refresh_token, settings.SECRET_KEY)
                    user = BasicUser.objects.get(pk=decoded_user['user_id'])
                    user.set_expo_push_token("")
                    user.save()
               except Exception as e:
                   print(e)
                   pass

               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=205)
        except Exception as e:
           print(e)
           return Response(status=400)
        
class userPreferences(APIView):
    def get(self, request):
        decoded_token = decode_token(request.headers['Authorization'])
        user = BasicUser.objects.get(pk=decoded_token['user_id'])

        data = {}
        try:
            logistics = user.get_logistics()
            data['logistics'] = [eval(i) for i in logistics] #convert strings to ints
            diet = user.get_diet()
            data['diet'] = [eval(i) for i in diet]
            data['postalCode'] = user.get_postal_code()

            return Response(data, 200)
        except Exception as e:
            print(e)
            return Response({e.__str__()}, 500)

    def post(self, request, format=None):
        decoded_token = decode_token(request.data['headers']['Authorization'])
        data = request.data['data']
        user = BasicUser.objects.get(pk=decoded_token['user_id'])
        
        try:  
            user.set_logistics(data['logistics'])
            user.set_diet(data['dietRequirements'])
            user.set_postal_code(data['postalCode'])
            if(data['postalCode']):
                user.update_coordinates()
            else:
                user.coordinates = ''

            user.save()   
        except Exception as e:
            print(e)
            return Response({e.__str__()}, 500)
        
        return Response({"success!!"}, 200)

class getNotifications(APIView):
    def post(self, request, format=None):
        try:
            user = BasicUser.objects.get(username=request.data['username'])
            notifications = user.notifications
            return Response(json.dumps(notifications, indent=1), status=200)
        except Exception as e:
            print(e)
            return Response(status=400)
        
class addNotification(APIView):
    def post(self, request, format=None):
        try:
            user = BasicUser.objects.get(username=request.data['user']['username'])
            data = request.data['notification']
            notifications = user.notifications

            notification = {
                "type" : data['type'],
                "user" : data['user'],
                "food" : data['food'],
                "time" : time.time()
            }
            notifications.append(notification)
            user.save()

            return Response(status=200)
            
        except Exception as e:
            print(e)
            return Response(status=400)

class clearNotification(APIView):
    def post(self, request, format=None):
        try:
            user = BasicUser.objects.get(username=request.data['user']['username'])
            timestamp = request.data['timestamp']
            notifications = user.notifications

            for notif in notifications:
                if notif['time'] == timestamp:
                    notifications.remove(notif)

            user.save()
            
            return Response(status=200)
        except Exception as e:
            print(e)
            return Response(status=400)
        
class clearAllNotifications(APIView):
    def post(self, request, format=None):
        try:
            user = BasicUser.objects.get(username=request.data['username'])
            setattr(user, 'notifications', [])
            user.save()
            return Response(status=200)
        except Exception as e:
            print(e)
            return Response(status=400)
