"""
ASGI config for ZH_Backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZH_Backend.settings')

from channels.routing import ProtocolTypeRouter, URLRouter

from apps.Chat.consumers import ChatConsumer, NotificationConsumer
from apps.Chat.middleware import TokenAuthMiddleware

django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
    path("chats/<conversation_name>/" , ChatConsumer.as_asgi()),
    path("notifications" , NotificationConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket" : TokenAuthMiddleware(URLRouter(websocket_urlpatterns)),
})