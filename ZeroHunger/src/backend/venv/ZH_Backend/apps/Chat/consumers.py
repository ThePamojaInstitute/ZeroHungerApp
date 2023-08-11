from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation, Message
from apps.Chat.serializers import MessageSerializer
from apps.Users.models import BasicUser
from collections import defaultdict
from django.contrib.auth.models import AnonymousUser
from uuid import UUID
import json
import requests
# from urllib import request, parse


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)

class ChatConsumer(JsonWebsocketConsumer):
    # This consumer is used to show user's online status, and send notifications.
    room_connection_counts = defaultdict(lambda: 0)

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.conversation_name = None
        self.conversation = None

    def connect(self):
        self.user = self.scope["user"]
        if not self.user:
            return
        
        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.room_connection_counts[self.conversation_name] += 1
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)

        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        messages = self.conversation.messages.all().order_by("-timestamp")[0:30]
        self.send_json({
            "type": "last_30_messages",
            "messages": MessageSerializer(messages, many=True).data,
        })

    def disconnect(self, code):
        self.room_connection_counts[self.conversation_name] -= 1
        print("Websocket disconnected!")
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "greeting":
            self.send_json({
            "type": "greeting_response",
            "message": "How are you?",
            })
        elif message_type == "chat_message":
            message = Message.objects.create(
                from_user=BasicUser.objects.get(username=self.user['username']),
                to_user=self.get_receiver(),
                content=content["message"],
                conversation=self.conversation
            )

            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name": self.user['username'],
                    "message": MessageSerializer(message).data,
                },
            )

            notification_group_name = self.get_receiver().username + "__notifications"

            print(f'Number of clients in {self.conversation_name}: {self.room_connection_counts[self.conversation_name]}')

            if(self.room_connection_counts[self.conversation_name] <= 1):
                receiver = BasicUser.objects.get(username=self.get_receiver().username)
                print(f'Reciever\'s expo token is: {receiver.get_expo_push_token()}')
                try:
                    # if the message is a post object
                    json.loads(MessageSerializer(message).data['content'])
                    is_json = True
                except ValueError as e:
                    is_json = False

                if(is_json): 
                    return

                push_message = {
                    'to': receiver.get_expo_push_token(),
                    'sound': 'default',
                    'title': f"New Message From {self.user['username']}",
                    'body': MessageSerializer(message).data['content'],
                }

                print(f'Push message: {push_message}')

                if(len(receiver.get_expo_push_token()) > 0):
                    try:
                        res = requests.post('https://exp.host/--/api/v2/push/send', json=push_message, headers={'User-Agent': "python-requests/2.31.0"})
                        print(res)
                    except Exception as e:
                        print(e)

            async_to_sync(self.channel_layer.group_send)(
                notification_group_name,
                {
                    "type": "new_message_notification",
                    "name": self.user['username'],
                    "message": MessageSerializer(message).data,
                },
            )

            unread = Message.objects.filter(to_user=self.get_receiver(), read=False)
            unread_count = unread.count()
            unread_from_users = []

            for msg in unread.values_list('from_user_id'):
                user_id = int(msg[0])
                user = BasicUser.objects.get(pk=user_id)
                unread_from_users.append(str(user))
            
            async_to_sync(self.channel_layer.group_send)(
                notification_group_name,
                {
                    "type": "unread_count",
                    "unread_count": unread_count,
                    "from_users": unread_from_users
                },
            )

        elif message_type == "read_messages":
            if(type(self.user) == AnonymousUser): return

            messages_to_me = self.conversation.messages.filter(to_user=self.user['user_id'])
            messages_to_me.update(read=True)

            # Update the unread message count
            unread = Message.objects.filter(to_user=self.user['user_id'], read=False)
            unread_from_users = []

            for msg in unread.values_list('from_user_id'):
                user_id = int(msg[0])
                user = BasicUser.objects.get(pk=user_id)
                unread_from_users.append(str(user))
                
            unread_count = unread.count()

            async_to_sync(self.channel_layer.group_send)(
                self.user['username'] + "__notifications",
                {
                    "type": "unread_count",
                    "unread_count": unread_count,
                    "from_users": unread_from_users
                },
            )
            return super().receive_json(content, **kwargs)
        
        elif message_type.startswith('render__'):
            # render from n[0] to n[1]
            n = message_type[8:].split('_')
            size = self.conversation.messages.all().count()
            if(size <= int(n[1])):
                messages = self.conversation.messages.all().order_by("-timestamp")[int(n[0]):size+1]
                self.send_json({
                    "type": "limit_reached",
                    "messages": MessageSerializer(messages, many=True).data,
                })
            else:
                messages = self.conversation.messages.all().order_by("-timestamp")[int(n[0]):int(n[1])]
                self.send_json({
                    "type": "render_x_to_y_messages",
                    "messages": MessageSerializer(messages, many=True).data,
                })
    
    def chat_message_echo(self, event):
        self.send_json(event)

    def get_receiver(self):
        usernames = self.conversation_name.split("__")
        for username in usernames:
            if username != self.user['username']:
                # This is the receiver
                return BasicUser.objects.get(username=username)
            
    def new_message_notification(self, event):
        self.send_json(event)
    
    def unread_count(self, event):
        self.send_json(event)
            
    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)
    
class NotificationConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.notification_group_name = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        if not self.user:
            return

        self.accept()

        # private notification group
        self.notification_group_name = self.user['username'] + "__notifications"
        async_to_sync(self.channel_layer.group_add)(
            self.notification_group_name,
            self.channel_name,
        )   

        # Send count of unread messages
        unread = Message.objects.filter(to_user=self.user['user_id'], read=False)
        unread_from_users = []

        for msg in unread.values_list('from_user_id'):
            user_id = int(msg[0])
            user = BasicUser.objects.get(pk=user_id)
            unread_from_users.append(str(user))
            
        unread_count = unread.count()
        self.send_json(
            {
                "type": "unread_count",
                "unread_count": unread_count,
                "from_users": unread_from_users
            }
        )
    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.notification_group_name,
            self.channel_name,
        )
        return super().disconnect(code)
    
    def new_message_notification(self, event):
        self.send_json(event)

    def unread_count(self, event):
        self.send_json(event)
