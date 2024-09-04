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
    
# class MessageSerializer(serializers.ModelSerializer):
#     from_user = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
#     to_user = serializers.models.ForeignKey(BasicUser, on_delete=models.CASCADE)
#     conversation = serializers.models.ForeignKey(Conversation, on_delete=models.CASCADE)
#     content = serializers.CharField(max_length=512)
#     timestamp = serializers.DateTimeField(default=datetime.now)
#     read = serializers.BooleanField(default=False)
    
#     # These fields are temporary fields, and won't be saved in the database
#     from_username = serializers.SerializerMethodField(method_name='get_from_username')
#     to_username = serializers.SerializerMethodField(method_name='get_to_username')

#     class Meta:
#         model = Message
#         fields = [
#             "id",
#             "conversation",
#             "from_user",
#             "from_username",
#             "to_user",
#             "to_username",
#             "content",
#             "timestamp",
#             "read"]

#     def get_conversation(self, obj):
#         return str(obj.conversation.id)

#     def get_from_user(self, obj):
#         return UserSerializer(obj.from_user).data
    
#     def get_from_username(self, obj):
#         if(type(obj) == collections.OrderedDict): # on creation
#             return None

#         user = obj.from_user
#         return user.username

#     def get_to_user(self, obj):
#         return UserSerializer(obj.to_user).data
    
#     def get_to_username(self, obj):
#         if(type(obj) == collections.OrderedDict): # on creation
#             return None

#         user = obj.to_user
#         return user.username
    
#     def save(self):
#         post = Message(conversation = self.validated_data['conversation'],
#                        from_user = self.validated_data['from_user'],
#                        to_user = self.validated_data['to_user'],
#                        content = self.validated_data['content'],
#                        timestamp = self.validated_data['timestamp'],
#                        read = self.validated_data['read'])
#         post.save()

class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "name", "other_user", "last_message")

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