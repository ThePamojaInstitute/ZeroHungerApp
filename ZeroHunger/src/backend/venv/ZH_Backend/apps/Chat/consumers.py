from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation, Message
from apps.Chat.serializers import MessageSerializer
from apps.Users.models import BasicUser
from uuid import UUID
import json


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)

class ChatConsumer(JsonWebsocketConsumer):
    # This consumer is used to show user's online status, and send notifications.

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
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)

        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        messages = self.conversation.messages.all().order_by("-timestamp")[0:50]
        self.send_json({
            "type": "last_50_messages",
            "messages": MessageSerializer(messages, many=True).data,
        })

    def disconnect(self, code):
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
            async_to_sync(self.channel_layer.group_send)(
                notification_group_name,
                {
                    "type": "new_message_notification",
                    "name": self.user['username'],
                    "message": MessageSerializer(message).data,
                },
            )
        
        elif message_type == "read_messages":
            messages_to_me = self.conversation.messages.filter(to_user=self.user['user_id'])
            messages_to_me.update(read=True)

            # Update the unread message count
            unread_count = Message.objects.filter(to_user=self.user['user_id'], read=False).count()
            async_to_sync(self.channel_layer.group_send)(
                self.user['username'] + "__notifications",
                {
                    "type": "unread_count",
                    "unread_count": unread_count,
                },
            )
            return super().receive_json(content, **kwargs)
    
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
        unread_count = Message.objects.filter(to_user=self.user['user_id'], read=False).count()
        self.send_json(
            {
                "type": "unread_count",
                "unread_count": unread_count,
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