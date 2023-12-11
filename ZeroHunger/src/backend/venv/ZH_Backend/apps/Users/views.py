from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from django.db.models import Q
from .models import BasicUser
from apps.Posts.models import RequestPost, OfferPost
from apps.Posts.views import serialize_posts
from .serializers import RegistrationSerializer, LoginSerializer, UpdateUserSerializer
from datetime import timedelta, datetime
import jwt
from django.core.mail import send_mail


def get_expiring_soon_posts(user):
    in_1_day = datetime.now().date() + timedelta(days=1)
    in_2_days = datetime.now().date() + timedelta(days=2)

    requests = RequestPost.objects.filter(
        Q(postedBy=user) & Q(fulfilled=False) &
        (Q(expiryDate__date=in_1_day) | Q(expiryDate__date=in_2_days))
    )
    offers = OfferPost.objects.filter(
        Q(postedBy=user) & Q(fulfilled=False) &
        (Q(expiryDate__date=in_1_day) | Q(expiryDate__date=in_2_days))
    )

    serialized_requests = serialize_posts(requests, "r")
    serialized_offers = serialize_posts(offers, "o")

    return serialized_requests.data + serialized_offers.data

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
            send_mail( "Zero Hunger Project - New User", "Welcome to the zero hunger project!", "noah@pamojainstitute.org", [serializer.data['email']], fail_silently=False)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

class edit_account_view(APIView):
    def get(self, request):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except Exception as e:
            print(e)
            return Response("User not found", 404)
        
        try:
            obj = {
                "username": user.username,
                "email" : user.email
            }
            return Response(obj, 200)
        except Exception as e:
            print(e)
            return Response(e, 500)

    def put(self, request, format=None):    
        try:
            decoded_token = jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("failed to authorize editing user", status=401)
        try:
            user_id = decoded_token['user_id']
            user = BasicUser.objects.get(pk=user_id)

            serializer = UpdateUserSerializer(data=request.data)
            if (serializer.is_valid()):
                serializer.update(instance=user)
                return Response(status=204)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status = 400)
        except Exception as e:
             print("exception" + str(e))
             return Response(str(e), status=500)

class deleteUser(APIView):
    def delete(self,request, format=None):
        try:
            decoded_token = jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
            print(decoded_token)
        except:
            return Response(status=401)

        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
            user.delete()

            return Response({"User deleted"}, 200)
        except:
            return Response(status=404)
    
class logIn(APIView):
    def post(self,request, format=None):
        serializer = LoginSerializer(data=request.data)
        if (serializer.is_valid()):
            try:
                user = BasicUser.objects.get(username=request.data['username'])
                platform = request.data['Platform']
                if(platform != 'web'):
                    user.set_expo_push_token(request.data['expo_push_token'])
                    user.save()
            except Exception as e:
                print(e)
                pass
            return serializer.logIn()
        else:
            return Response({"Error logging in", 400})
                
class logOut(APIView):
    def post(self,request, format=None):
        try:
               refresh_token = request.data["refresh_token"]
               platform = request.data["Platform"]
               try:  
                    decoded_user = jwt.decode(refresh_token, settings.SECRET_KEY)
                    user = BasicUser.objects.get(pk=decoded_user['user_id'])
                    if(platform != 'web'):
                        user.set_expo_push_token("")
                        user.save()
               except Exception as e:
                   print(e)
                   pass

               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=205)
        except Exception as e:
            if(e.__str__() == "Token is blacklisted"):
                return Response(status=205)
            else:
                try: # if no refresh token
                    token = RefreshToken(refresh_token)
                except:
                    return Response(status=205)
                return Response(status=400)
        
class userPreferences(APIView):
    def get(self, request):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except Exception:
            return Response("User not found", 404)

        data = {}
        try:
            data['logistics'] = user.get_logistics()
            data['diet'] = user.get_diet()
            data['postalCode'] = user.get_postal_code()
            data['distance'] = user.get_distance()

            return Response(data, 200)
        except Exception as e:
            print(e)
            return Response({e.__str__()}, 500)

    def post(self, request, format=None):
        try:
            decoded_token =  jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except Exception:
            return Response("User not found", 404)
        
        data = request.data['data']
        try:  
            user.set_logistics(data['logistics'])
            user.set_diet(data['dietRequirements'])
            user.set_postal_code(data['postalCode'])
            user.set_distance(data['distance'])
            if(data['postalCode']):
                user.update_coordinates()
            else:
                user.longitude = None
                user.latitude = None

            user.save()   
        except Exception as e:
            print(e)
            return Response(e.__str__(), 500)
        
        return Response(status=204)

class getNotifications(APIView):
    def get(self, request, format=None):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            from_screen = request.GET.get('from',"")
        except Exception as e:
            return Response(e.__str__(), 400) 
        
        if((user.allowExpiringPostsNotifications == False and from_screen == 'home')):
            return Response(status=204)
        
        try:
            expiring_soon_posts = get_expiring_soon_posts(user)
        except Exception as e:
            Response(e, 500)

        return Response(expiring_soon_posts, 200)

# class addNotification(APIView):
#     def post(self, request, format=None):
#         try:
#             user = BasicUser.objects.get(username=request.data['user']['username'])
#             data = request.data['notification']
#             notifications = user.notifications

#             notification = {
#                 "type" : data['type'],
#                 "user" : data['user'],
#                 "food" : data['food'],
#                 "time" : time.time()
#             }
#             notifications.append(notification)
#             user.save()

#             return Response(status=200)
            
#         except Exception as e:
#             print(e)
#             return Response(status=400)

# class clearNotification(APIView):
#     def post(self, request, format=None):
#         try:
#             user = BasicUser.objects.get(username=request.data['user']['username'])
#             timestamp = request.data['timestamp']
#             notifications = user.notifications

#             for notif in notifications:
#                 if notif['time'] == timestamp:
#                     notifications.remove(notif)

#             user.save()
            
#             return Response(status=200)
#         except Exception as e:
#             print(e)
#             return Response(status=400)
        
# class clearAllNotifications(APIView):
#     def post(self, request, format=None):
#         try:
#             user = BasicUser.objects.get(username=request.data['username'])
#             setattr(user, 'notifications', [])
#             user.save()
#             return Response(status=200)
#         except Exception as e:
#             print(e)
#             return Response(status=400)
#         return Response(status=204)

class getNotificationsSettings(APIView):
    def get(self, request, format=None):
        try:
            decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            permissions = {
                'newMessages': user.allowNewMessagesNotifications,
                'expiringPosts': user.allowExpiringPostsNotifications
            }
        except Exception as e:
            Response(e, 500)

        return Response(permissions, 200)
    
class updateNotificationsSettings(APIView):
    def put(self, request, format=None):
        try:
            decoded_token =  jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
            user = BasicUser.objects.get(pk=decoded_token['user_id'])
        except:
            return Response("Token invalid or not given", 401)
        
        try:
            allowExpiringPosts = request.data['data']['allowExpiringPosts']
            allowNewMessages =  request.data['data']['allowNewMessages']

            user.allowExpiringPostsNotifications = allowExpiringPosts
            user.allowNewMessagesNotifications = allowNewMessages

            user.save()
        except Exception as e:
            return Response(e, 500)

        return Response(status=204)