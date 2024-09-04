from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.Chat.views import ConversationViewSet, messageHistory, sendMessage

router = DefaultRouter()
router.register("conversations", ConversationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('messageHistory', messageHistory.as_view(), name = 'message_history'),
    # path('sendMessage', sendMessage.as_view(), name = 'send_message')
]