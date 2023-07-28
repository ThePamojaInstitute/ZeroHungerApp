from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from django.db.models import Q
from .models import BasicUser
from .serializers import RegistrationSerializer, LoginSerializer
from apps.Chat.models import Conversation
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
      
    
class deleteUser(APIView):
    def delete(self,request, format=None):
        try:
            decoded_token = jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
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
    
class modifyUser(APIView):
    def post(self,request, format=None):
        return Response({"You made it to POST in modifyUser"})
    
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
