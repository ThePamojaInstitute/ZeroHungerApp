from django.test import TestCase
from django.test import Client
from django.urls import reverse
from datetime import datetime
from apps.Users.models import BasicUser

#Run tests with "python manage.py test backendAPI.test_models"

class TestModels(TestCase):
    # client = Client()

    #Tests basic user model creation
    def test_BasicUser(self):
        user = BasicUser(username='test_username', email='test@test.com')

        self.assertEquals(str(user), 'test_username')
        self.assertEquals(user.email, 'test@test.com')
        self.assertFalse(user.is_staff) #Change for staff and superusers
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_superuser)