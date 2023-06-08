from django.test import TestCase
from apps.Chat.models import Message, Conversation
from apps.Users.models import BasicUser
from apps.Users.serializers import UserSerializer
from apps.Chat.serializers import MessageSerializer, ConversationSerializer

class MessageSerializerTest(TestCase):
    def setUp(self):
        self.user1 = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
        self.user2 = BasicUser.objects.create_user(username="testuser2", email="test2@email.com", password="test2")
        self.conversation = Conversation.objects.create(name='testuser1__testuser2')
        self.message = Message.objects.create(
            conversation=self.conversation,
            from_user=self.user1,
            to_user=self.user2,
            content='test',
            timestamp='2023-01-01',
            read=False
        )
        self.serializer = MessageSerializer(instance=self.message)

    def test_get_conversation(self):
        conversation_id = str(self.conversation.id)
        self.assertEqual(self.serializer.get_conversation(self.message), conversation_id)

    def test_get_from_user(self):
        expected_data = UserSerializer(self.user1).data
        self.assertEqual(self.serializer.get_from_user(self.message), expected_data)

    def test_get_to_user(self):
        expected_data = UserSerializer(self.user2).data
        self.assertEqual(self.serializer.get_to_user(self.message), expected_data)

class ConversationSerializerTest(TestCase):
    def setUp(self):
        self.user1 = BasicUser.objects.create_user(username="testuser1", email="test1@email.com", password="test1")
        self.user2 = BasicUser.objects.create_user(username="testuser2", email="test2@email.com", password="test2")
        self.conversation = Conversation.objects.create(name='testuser1__testuser2')
        self.message = Message.objects.create(
            conversation=self.conversation,
            from_user=self.user1,
            to_user=self.user2,
            content='test',
            timestamp='2023-01-01',
            read=False
        )
        self.serializer = ConversationSerializer(instance=self.conversation, context={'user': self.user1})

    def test_get_last_message(self):
        expected_data = MessageSerializer(self.message).data
        self.assertEqual(self.serializer.get_last_message(self.conversation), expected_data)

    def test_get_other_user(self):
        context = {'user': self.user1}
        expected_data = UserSerializer(self.user2, context=context).data
        self.assertEqual(self.serializer.get_other_user(self.conversation), expected_data)

