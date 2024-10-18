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