import pytest
from django.db import IntegrityError
from apps.Users.models import BasicUser
from apps.Chat.models import Conversation, Message


@pytest.mark.django_db
def test_create_conversation():
    conversation = Conversation.objects.create(name="Test Conversation")
    conversation_db = Conversation.objects.get(id=conversation.id)
    
    assert conversation_db.name == "Test Conversation"
    

@pytest.mark.django_db
def test_create_message():
    user1 = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
    user2 = BasicUser.objects.create_user(username="testuser2", email="test2@email.com", password="test2")
    conversation = Conversation.objects.create(name="Test Conversation")
    
    message = Message.objects.create(
        conversation=conversation,
        from_user=user1,
        to_user=user2,
        content="Hello, testuser2!"
    )
    
    message_db = Message.objects.get(id=message.id)
    
    assert message_db.conversation == conversation
    assert message_db.from_user == user1
    assert message_db.to_user == user2
    assert message_db.content == "Hello, testuser2!"
    assert message_db.read == False
    
@pytest.mark.django_db
def test_create_message_without_conversation():
    user1 = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
    user2 = BasicUser.objects.create_user(username="testuser2", email="test2@email.com", password="test2")
    
    with pytest.raises(IntegrityError):
        Message.objects.create(
            from_user=user1,
            to_user=user2,
            content="Hello, user2!"
        )

@pytest.mark.django_db
def test_create_message_without_users():
    conversation = Conversation.objects.create(name="Test Conversation")
    
    with pytest.raises(IntegrityError):
        Message.objects.create(
            conversation=conversation,
            content="Hello, user2!"
        )

@pytest.mark.django_db
def test_create_message_without_from_user():
    user = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
    conversation = Conversation.objects.create(name="Test Conversation")
    
    with pytest.raises(IntegrityError):
        Message.objects.create(
            conversation=conversation,
            to_user=user,
            content="Hello, user2!"
        )

@pytest.mark.django_db
def test_create_message_without_to_user():
    user = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
    conversation = Conversation.objects.create(name="Test Conversation")
    
    with pytest.raises(IntegrityError):
        Message.objects.create(
            conversation=conversation,
            from_user=user,
            content="Hello, user2!"
        )