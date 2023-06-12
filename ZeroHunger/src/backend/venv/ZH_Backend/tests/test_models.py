from django.test import TestCase
from django.test import Client
from django.urls import reverse
from datetime import datetime
from apps.Users.models import BasicUser
from apps.Posts.models import OfferPost, RequestPost

#Run tests with "python manage.py test backendAPI.test_models"

class TestModels(TestCase):
    # client = Client()

    #Test offer post model creation
    def test_OfferPost(self):
        date_now = datetime.now()

        offer_post = OfferPost(
            title="Test Title",
            images="testImageLink",
            postedOn=date_now,
            postedBy=0,
            description="test description",
            postType="r"
        )
        
        self.assertEquals(offer_post.title, 'Test Title')
        self.assertEquals(offer_post.images, 'testImageLink')
        self.assertEquals(offer_post.postedOn, date_now)
        self.assertIsInstance(offer_post.postedBy, int)
        self.assertEquals(offer_post.description, 'test description')
        self.assertEquals(offer_post.postType, "r")

    #Test request post model creation
    def test_RequestPost(self):
        date_now = datetime.now()

        request_post = RequestPost(
            title="Test Title",
            images="testImageLink",
            postedOn=date_now,
            postedBy=0,
            description="test description",
            postType="r"
        )
        
        self.assertEquals(request_post.title, 'Test Title')
        self.assertEquals(request_post.images, 'testImageLink')
        self.assertEquals(request_post.postedOn, date_now)
        self.assertIsInstance(request_post.postedBy, int)
        self.assertEquals(request_post.description, 'test description')
        self.assertEquals(request_post.postType, "r")

    #Tests basic user model creation
    def test_BasicUser(self):
        user = BasicUser(username='test_username', email='test@test.com')

        self.assertEquals(str(user), 'test_username')
        self.assertEquals(user.email, 'test@test.com')
        self.assertFalse(user.is_staff) #Change for staff and superusers
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_superuser)