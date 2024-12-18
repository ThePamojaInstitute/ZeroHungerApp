from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.Chat.views import ConversationViewSet, updatePhoneStatus, updateEmailStatus, updateMuteStatus

router = DefaultRouter()
router.register("conversations", ConversationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('updatePhoneStatus', updatePhoneStatus.as_view(), name = 'update_phone_status'),
    path('updateEmailStatus', updateEmailStatus.as_view(), name = 'update_email_status'),
    path('updateMuteStatus', updateMuteStatus.as_view(), name='update_mute_status')
    # path('messageHistory', messageHistory.as_view(), name = 'message_history'),
    # path('sendMessage', sendMessage.as_view(), name = 'send_message')
]

# 'chat/updateEmailStatus'