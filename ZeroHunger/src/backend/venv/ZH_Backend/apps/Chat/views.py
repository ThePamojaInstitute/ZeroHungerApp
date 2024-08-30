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
    
    
# class MessageViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
#     serializer_class = MessageSerializer
#     queryset = Message.objects.none()
#     lookup_field = "conversation"
    
#     def get_queryset(self):
#         try:
#             decoded_token = jwt.decode(self.request.headers['Authorization'], settings.SECRET_KEY)
#         except:
#             return ""
        
#         # queryset = Message.objects.filter(
#         #     Q(from_user=f"{decoded_token['from_user']}") |
#         #     Q(to_user=f"{decoded_token['to_user']}")
#         # )
        
#         conversation = Conversation.objects.filter()
        
#         queryset = Message.objects.filter(
#             (Q(conversation__startswith=f"{decoded_token['username']}__") | 
#             Q(conversation__endswith=f"__{decoded_token['username']}")) &
#             (~Q(conversation__startswith=f"undefined__") & 
#             ~Q(conversation__endswith=f"__undefined"))
#         )
        
#         return queryset
    
#     def get_serializer_context(self):
#         try:
#             decoded_token = jwt.decode(self.request.headers['Authorization'], settings.SECRET_KEY)
#         except:
#             return Response(status=401)

#         return {"request": self.request, "user": BasicUser.objects.get(username=decoded_token['username'])}

def createConversation(user1, user2):
    #name
    #user1
    #user2
    serializer = Conversation()
    # usernames = []
    # usernames.append(user1)
    # usernames.append(user2)
    # usernames.sort()
    
    # # serializer.user1 = BasicUser.objects.get(username = usernames[0]).pk
    # # serializer.user2 = BasicUser.objects.get(username = usernames[1]).pk
    
    # serializer.name = f"{usernames[0]}__{usernames[1]}"
    serializer.name = f"{user1}__{user2}"
    serializer.save()
    
    
### WRITE HERE RECEIVING MESSAGE
class sendMessage(APIView):
    def post(self, request, format=JSONParser):
        from_user = request.data['postData']['from_user']
        request.data['postData']['from_user'] = BasicUser.objects.get(username=from_user).pk
        to_user = request.data['postData']['to_user']
        request.data['postData']['to_user'] = BasicUser.objects.get(username=to_user).pk
        
        usernames = []
        usernames.append(from_user)
        usernames.append(to_user)
        usernames.sort()
        conversation = f"{usernames[0]}__{usernames[1]}"
        if not Conversation.objects.filter(Q(name=conversation)): ### queryset is empty, make the conversation
            if not (from_user == 'undefined' or to_user == 'undefined'): ### check for undefined users
                createConversation(from_user, to_user)
            else:
                return Response("Undefined users in conversation", status=400)
                
        request.data['postData']['conversation'] = Conversation.objects.get(name=conversation).pk
        
        content = request.data['postData']['content']
        
        if(len(content) == 0):
            return Response("No inputted message", status=400)
        
        serializer = MessageSerializer(data=request.data['postData'])
        
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)
    
def get_messages(conv):
    try:
        messages = Message.objects.filter(
            conversation = Conversation.objects.get(name = conv) #conversation = conv, 
        ).all().order_by('timestamp')
        
        # print(messages)
        
        # messages = messages.annotate(conversation = conv)
        # messages = messages[0]
        
        return messages
    
    except Exception as e:
        print(e)
        return Response(e.__str__(), 500) 
    
def serialize_messages(messages):
    try:
        serializer = MessageSerializer(messages, many=True)
        return serializer
    
    except Exception as e:
        print(e)
        return Response(e.__str__(), 500) 
class messageHistory(APIView):
    def get(self, request):
        # try:
        #     decoded_token =  jwt.decode(request.headers['Authorization'], settings.SECRET_KEY)
        # except:
        #     return Response("Token invalid or not given", 401)
        try:
            # return Response("Hello", 200)
            conversation = request.GET.get('conversation', "undefined__undefined")
            
        except Exception as e:
            return Response(e.__str__(), 400)
        
        usernames = conversation.split("__")
        for username in usernames:
            if username == 'undefined':
                return Response("Undefined conversation", 400)
            
        try:
            messages = get_messages(conversation)
            serializer = serialize_messages(messages)
        except Exception as e:
            return Response(e.__str__(), 500) 
        
        return Response(serializer.data, status = 200)
            