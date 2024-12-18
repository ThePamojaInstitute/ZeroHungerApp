from django.conf import settings
from django.db.models import Q, Value, FloatField
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from apps.Chat.models import Conversation, Message
from apps.Chat.serializers import ConversationSerializer, MessageSerializer
from apps.Users.models import BasicUser
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import jwt

class ConversationViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.none()
    lookup_field = "name"

    def get_queryset(self):
        try:
            decoded_token = jwt.decode(self.request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return ""

        queryset = Conversation.objects.filter(
            (Q(name__startswith=f"{decoded_token['username']}__") | 
            Q(name__endswith=f"__{decoded_token['username']}")) &
            (~Q(name__startswith=f"undefined__") & 
            ~Q(name__endswith=f"__undefined"))
        )

        return queryset

    def get_serializer_context(self):
        try:
            decoded_token = jwt.decode(self.request.headers['Authorization'], settings.SECRET_KEY)
        except:
            return Response(status=401)

        return {"request": self.request, "user": BasicUser.objects.get(username=decoded_token['username'])}
    
class updatePhoneStatus(APIView):
    def post(self, request):
        # print(f"Got this far!")
        try:
            # print(f"Got this far! 1")
            decoded_token = jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        # print(f"Got this far! 2")
        if decoded_token['username'] not in request.data['data']['conversation']:
            return Response("Invalid conversation", 400)
        
        try:
            # print(f"Got this far! 3")
            # request.data['data']['user']
            # print(f"Trying to print {request.data['data']['conversation']}")
            convo = Conversation.objects.get(name = request.data['data']['conversation'])
            if (convo.sentPhoneNum == False):
                convo.sentPhoneNum = True
                convo.save(update_fields=['sentPhoneNum'])
            return Response(status=200)
        
        except:
            return Response("Invalid conversation", status=400)
        
class updateEmailStatus(APIView):
    def post(self, request):
        try:
            # print(f"Got this far! 1")
            decoded_token = jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        if decoded_token['username'] not in request.data['data']['conversation']:
            return Response("Invalid conversation", 400)
        
        try:
            # print(f"Got this far! 3")
            # request.data['data']['user']
            # print(f"Trying to print {request.data['data']['conversation']}")
            convo = Conversation.objects.get(name = request.data['data']['conversation'])
            if (convo.sentEmail == False):
                convo.sentEmail = True
                convo.save(update_fields=['sentEmail'])
            return Response(status=200)
        
        except:
            return Response("Invalid conversation", status=400)

class updateMuteStatus(APIView):
    def post(self, request):
        try:
            decoded_token = jwt.decode(request.data['headers']['Authorization'], settings.SECRET_KEY)
        except:
            return Response("Token invalid or not given", 401)
        
        if decoded_token['username'] not in request.data['data']['conversation']:
            return Response("Invalid conversation", 400)
        
        try:
            mute_status = False #initializing
            usernames = request.data['data']['conversation'].split("__")
            convo = Conversation.objects.get(name = request.data['data']['conversation'])
            
            if decoded_token['username'] == usernames[0]:
                convo.user1Muted = not convo.user1Muted
                convo.save(update_fields=['user1Muted'])
                mute_status = convo.user1Muted
                
            elif decoded_token['username'] == usernames[1]:
                convo.user2Muted = not convo.user2Muted
                convo.save(update_fields=['user2Muted'])
                mute_status = convo.user2Muted
                
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                request.data['data']['conversation'],
                {
                    "type": "update_mute_status",
                    "user": decoded_token['username'],
                    "mute_status": mute_status
                }
            )
            return Response(status=200)
        
        except:
            return Response("Invalid conversation", status=400)
        