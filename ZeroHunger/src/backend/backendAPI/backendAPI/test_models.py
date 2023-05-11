from django.test import TestCase
from django.test import Client
from django.urls import reverse
from datetime import datetime
from .models import BoardPost, BasicUser

#Run tests with "python manage.py test backendAPI.test_models"

class TestModels(TestCase):
    # client = Client()

    #Test board post model creation
    def test_BoardPost(self):
        post = BoardPost(_productType='test_type', 
                         _postedBy=0, 
                         _postedOn=datetime.now(),
                         _postCaption='test')
        
        self.assertEquals(post._productType, 'test_type')
        self.assertIsInstance(post._postedBy, int)
        self.assertEquals(post._postedOn, datetime.now())
        self.assertEquals(post._postCaption, 'test')

    #Tests basic user model creation
    def test_BasicUser(self):
        user = BasicUser(username='test_username', email='test@test.com')

        self.assertEquals(str(user), 'test_username')
        self.assertEquals(user.email, 'test@test.com')
        self.assertFalse(user.is_staff) #Change for staff and superusers
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_superuser)