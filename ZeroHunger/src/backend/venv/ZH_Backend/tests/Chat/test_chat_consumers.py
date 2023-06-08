from channels.testing import WebsocketCommunicator
from apps.Users.models import BasicUser
from django.test import RequestFactory
from apps.Chat.consumers import ChatConsumer, NotificationConsumer
import pytest


@pytest.fixture
def chat_communicator(scope="module"):
    factory = RequestFactory()
    request = factory.get("/")
    BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
    request.user = {'username': "testuser1"}
    communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "ws://127.0.0.1:8000/", headers=[("Authorization", "Token testToken")])
    communicator.scope["user"] = request.user
    communicator.scope["url_route"] = {"kwargs": {"conversation_name": "testuser1__testuser2"}}
    return communicator

@pytest.fixture
def chat_communicator_2(scope="module"):
    factory = RequestFactory()
    request = factory.get("/")
    BasicUser.objects.create_user(username="testuser2", email="test2@email.com", password="test2")
    request.user = {'username': "testuser2"}
    communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "ws://127.0.0.1:8000/", headers=[("Authorization", "Token testToken")])
    communicator.scope["user"] = request.user
    communicator.scope["url_route"] = {"kwargs": {"conversation_name": "testuser1__testuser2"}}
    return communicator

@pytest.fixture
def notification_communicator(scope="module"):
    factory = RequestFactory()
    request = factory.get("/")
    request.user = {'username': "testuser2", 'user_id': 2 }
    communicator = WebsocketCommunicator(NotificationConsumer.as_asgi(), "ws://127.0.0.1:8000/",  headers=[("Authorization", "Token testToken")])
    communicator.scope["user"] = request.user
    communicator.scope["url_route"] = {"kwargs": {"conversation_name": "test_conversation"}}
    return communicator

@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_chat_consumer(chat_communicator, chat_communicator_2):
    connected, _ = await chat_communicator.connect()
    assert connected
    connected, _ = await chat_communicator_2.connect()
    assert connected

    response = await chat_communicator.receive_json_from()
    assert response["type"] == "last_30_messages"
    assert response["messages"] == []

    message = {
        "type": "chat_message",
        "message": "Hello, how are you?"
    }

    await chat_communicator.send_json_to(message)
    response = await chat_communicator.receive_json_from()

    # Assert the chat message echo
    assert response["type"] == "chat_message_echo"
    assert response["name"] == "testuser1"
    assert response["message"]["content"] == "Hello, how are you?"

    # Send 5 messages 
    for i in range(5):
        message = {
            "type": "chat_message",
            "message": "Hello, how are you?"
        }

        await chat_communicator.send_json_to(message)
        response = await chat_communicator.receive_json_from()

    # Test rendering x amount of messages
    message = {
        "type": "render__0_5",
    }

    await chat_communicator.send_json_to(message)
    response = await chat_communicator.receive_json_from()

    assert response["type"] == "render_x_to_y_messages"
    assert len(response["messages"]) == 5

    # Test messages from index 5 to 10
    # When 1 message is left
    message = {
        "type": "render__5_10",
    }

    await chat_communicator.send_json_to(message)
    response = await chat_communicator.receive_json_from()

    assert response["type"] == "limit_reached"
    assert len(response["messages"]) == 1

    # Test rendering messages when no messages left
    message = {
        "type": "render__10_20",
    }

    await chat_communicator.send_json_to(message)
    response = await chat_communicator.receive_json_from()

    assert response["type"] == "limit_reached"
    assert len(response["messages"]) == 0

    await chat_communicator.disconnect()
    await chat_communicator_2.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_notification_consumer(notification_communicator):
    connected, _ = await notification_communicator.connect()
    assert connected

    # Test initial unread count and from_users
    response = await notification_communicator.receive_json_from()
    assert response["type"] == "unread_count"
    assert response["unread_count"] == 0
    assert response["from_users"] == []

    await notification_communicator.disconnect()

@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_chat_consumer_with_notification(chat_communicator, chat_communicator_2, notification_communicator):
    connected, _ = await chat_communicator.connect()
    assert connected
    connected, _ = await chat_communicator_2.connect()
    assert connected
    connected, _ = await notification_communicator.connect()
    assert connected

    # Receive initial responses 
    await chat_communicator.receive_json_from()
    await chat_communicator_2.receive_json_from()
    await notification_communicator.receive_json_from()  
    
    message = {
        "type": "chat_message",
        "message": "test_message"
    }

    # Send message from testuser1
    await chat_communicator.send_json_to(message)
    await chat_communicator.receive_json_from()

    # Receive notification update for new message for testuser2
    response = await notification_communicator.receive_json_from()
    assert response["type"] == "new_message_notification"
    assert response["name"] == "testuser1"
    assert response["message"]["content"] == "test_message"
    
    # Receive notification update for unread count for testuser2
    response = await notification_communicator.receive_json_from()
    assert response["type"] == "unread_count"
    assert response["unread_count"] == 1
    assert response["from_users"] == ['testuser1']

    await chat_communicator.disconnect()
    await chat_communicator_2.disconnect()
    await notification_communicator.disconnect()