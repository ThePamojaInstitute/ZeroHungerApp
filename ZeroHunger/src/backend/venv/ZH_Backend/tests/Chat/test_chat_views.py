import pytest
import jwt
from django.conf import settings
from django.test import RequestFactory
from apps.Chat.models import Conversation
from apps.Users.models import BasicUser
from apps.Chat.views import ConversationViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory

@pytest.fixture
def conversation_factory():
    def create_conversation(name):
        return Conversation.objects.create(name=name)
    return create_conversation

# Create user
@pytest.fixture
def user_factory():
    def create_user(username):
        return BasicUser.objects.create_user(username=username, email=f"{username}@email.com", password="test")
    return create_user

# Create token
@pytest.fixture
def token_factory():
    def create_token(username):
        return jwt.encode({'username': username}, settings.SECRET_KEY, algorithm='HS256')
    return create_token
# Create request
@pytest.fixture
def request_factory():
    return RequestFactory()

# Create api request
@pytest.fixture
def api_request_factory():
    return APIRequestFactory()

# Get ConversationViewSet
@pytest.fixture
def conversation_viewset():
    return ConversationViewSet()

@pytest.mark.django_db(transaction=True)
def test_get_queryset(conversation_factory, user_factory, token_factory, request_factory, conversation_viewset):
    user_factory('testuser')
    conversation_factory('testuser__testuser1')
    conversation_factory('testuser2__testuser')
    conversation_factory('testuser__testuser3')
    
    token = token_factory('testuser')
    request = request_factory.get('/conversations/')
    request.META['HTTP_AUTHORIZATION'] = token

    conversation_viewset.request = request
    conversation_viewset.action = 'list'
    conversation_viewset.format_kwarg = None

    queryset = conversation_viewset.get_queryset()

    assert queryset.count() == 3
    assert 'testuser__testuser1' in queryset[0].name
    assert 'testuser2__testuser' in queryset[1].name
    assert 'testuser__testuser3' in queryset[2].name

@pytest.mark.django_db(transaction=True)
def test_get_serializer_context(user_factory, token_factory, api_request_factory, conversation_viewset):
    user = user_factory('testuser')
    
    token = token_factory('testuser')
    request = api_request_factory.get('/conversations/')
    request.META['HTTP_AUTHORIZATION'] = token

    conversation_viewset.request = request
    conversation_viewset.action = 'list'
    conversation_viewset.format_kwarg = None

    serializer_context = conversation_viewset.get_serializer_context()

    assert serializer_context['request'] == request
    assert serializer_context['user'] == user

@pytest.mark.django_db(transaction=True)
def test_retrieve_conversation(conversation_factory, user_factory, token_factory, api_request_factory, conversation_viewset):
    user_factory('testuser1')
    user_factory('testuser2')
    conversation = conversation_factory('testuser1__testuser2')
    
    token = token_factory('testuser1')
    request = api_request_factory.get(f'/conversations/{conversation.name}/')
    request.META['HTTP_AUTHORIZATION'] = token

    conversation_viewset.request = request
    conversation_viewset.action = 'retrieve'
    conversation_viewset.format_kwarg = None
    conversation_viewset.kwargs = {'name': conversation.name}

    response = conversation_viewset.retrieve(request, name=conversation.name)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == conversation.name
