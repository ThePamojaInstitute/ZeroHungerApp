import collections
from rest_framework import serializers
from django.db import models
from apps.Chat.models import Message, Conversation
from apps.Users.serializers import UserSerializer
from apps.Users.models import BasicUser
from datetime import datetime 

class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    conversation = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read",
        )

    def get_conversation(self, obj):
        return str(obj.conversation.id)

    def get_from_user(self, obj):
        return UserSerializer(obj.from_user).data

    def get_to_user(self, obj):
        return UserSerializer(obj.to_user).data
    

class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    self_muted = serializers.SerializerMethodField()
    # other_muted = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "name", "other_user", "last_message", "self_muted")

    def get_last_message(self, obj):
        messages = obj.messages.all().order_by("-timestamp")
        if not messages.exists():
            return None
        message = messages[0]
        return MessageSerializer(message).data

    def get_other_user(self, obj):
        usernames = obj.name.split("__")
       
        context = {}
        for username in usernames:
            if(username == 'undefined'):
                return None
            elif username != self.context["user"].username:
                # This is the other participant
                try:
                    other_user = BasicUser.objects.get(username=username)
                    return UserSerializer(other_user, context=context).data
                except Exception as e:
                    print(e)
                    return None
    
    def get_self_muted(self, obj):
        usernames = obj.name.split("__")
        
        context = {}
        try:
            if usernames[0] == self.context["user"].username:
                return obj.user1Muted
            elif usernames[1] == self.context["user"].username:
                return obj.user2Muted
        except Exception as e:
            print(e)
            return None