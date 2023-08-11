from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.Chat.views import ConversationViewSet

router = DefaultRouter()
router.register("conversations", ConversationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]