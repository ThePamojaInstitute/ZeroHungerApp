from django.urls import reverse
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.test import APITestCase
from apps.Users.models import BasicUser
from apps.Posts.models import RequestPost, OfferPost
import json
import jwt
import pytest


def create_request_data():
    return {
        'postData': {
            'title' : "Test Title",
            'images' : "testImageLink",
            'postedOn': 1,
            'postedBy' : 1,
            'description' : "test description"
        },
        'postType' : "r"
    }

def create_offer_data():
    return {
        'postData': {
            'title' : "Test Title",
            'images' : "testImageLink",
            'postedOn': 1,
            'postedBy' : 1,
            'description' : "test description"
        },
        'postType' : "o"
    }

class CreatePostTest(APITestCase):
    def setUp(self):
        self.url = reverse('create_post')
        return self

    def test_create_request(self):
        data = create_request_data()
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_offer(self):
        data = create_offer_data()
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_request_without_title(self):
        data = create_request_data()
        data['postData'].pop('title')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_offer_without_title(self):
        data = create_offer_data()
        data['postData'].pop('title')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_request_without_images(self):
        data = create_request_data()
        data['postData']['images'] = ""
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_offer_without_images(self):
        data = create_offer_data()
        data['postData']['images'] = ""
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_request_without_postedOn(self):
        data = create_request_data()
        data['postData'].pop('postedOn')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_offer_without_postedOn(self):
        data = create_offer_data()
        data['postData'].pop('postedOn')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_request_without_postedBy(self):
        data = create_request_data()
        data['postData'].pop('postedBy')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_offer_without_postedBy(self):
        data = create_offer_data()
        data['postData'].pop('postedBy')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_request_without_description(self):
        data = create_request_data()
        data['postData']['description'] = ""
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_offer_without_description(self):
        data = create_offer_data()
        data['postData']['description'] = ""
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201

    def test_create_request_without_postType(self):
        data = create_request_data()
        data['postData'].pop('title')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

    def test_create_offer_without_postType(self):
        data = create_offer_data()
        data['postData'].pop('title')
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 401

class DeletePostTest(APITestCase):
    def setUp(self):
        self.token = jwt.encode({'user_id': 1}, settings.SECRET_KEY, algorithm='HS256')
        self.request_data = {
            'postType': 'r',
            'postId': 1,
        }
        self.offer_data = {
            'postType': 'o',
            'postId': 1,
        }
        self.url = reverse('delete_post')
        return self

    def test_delete_request_post_without_token(self):
        response = self.client.delete(self.url, self.request_data, format='json')
        assert response.status_code == 401

    def test_delete_offer_post_without_token(self):
        response = self.client.delete(self.url, self.offer_data, format='json')
        assert response.status_code == 401

    def test_delete_request_post_with_token(self):
        response = self.client.delete(self.url, self.request_data, headers={'Authorization': self.token}, format='json')
        # user authorizerd but post not found
        assert response.status_code == 404

    def test_delete_request_post_with_token(self):
        response = self.client.delete(self.url, self.offer_data, headers={'Authorization': self.token}, format='json')
        # user authorizerd but post not found
        assert response.status_code == 404

    def test_delete_request_post_with_post_but_diff_owner(self):
        data = create_request_data()
        data['postData']['postedBy'] = 0
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201

        response = self.client.delete(self.url, self.request_data, headers={'Authorization': self.token}, format='json')
        # user id is different from postedBy in post
        assert response.status_code == 401

    def test_delete_offer_post_with_post_but_diff_owner(self):
        data = create_offer_data()
        data['postData']['postedBy'] = 0
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201

        response = self.client.delete(self.url, self.offer_data, headers={'Authorization': self.token}, format='json')
        # user id is different from postedBy in post
        assert response.status_code == 401

    def test_delete_request_post(self):
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201

        response = self.client.delete(self.url, self.request_data, headers={'Authorization': self.token}, format='json')
        # post deleted successfully
        assert response.status_code == 200

    def test_delete_offer_post(self):
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201

        response = self.client.delete(self.url, self.offer_data, headers={'Authorization': self.token}, format='json')
        # post deleted successfully
        assert response.status_code == 200

    def test_deleted_request_post_existence(self):
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        assert RequestPost.objects.get(pk=1).title == 'Test Title'

        response = self.client.delete(self.url, self.request_data, headers={'Authorization': self.token}, format='json')
        assert response.status_code == 200
        # posted doesn't exist after deletion
        with pytest.raises(ObjectDoesNotExist):
            RequestPost.objects.get(pk=1)

    def test_deleted_offer_post_existence(self):
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        assert OfferPost.objects.get(pk=1).title == 'Test Title'

        response = self.client.delete(self.url, self.offer_data, headers={'Authorization': self.token}, format='json')
        assert response.status_code == 200
        # posted doesn't exist after deletion
        with pytest.raises(ObjectDoesNotExist):
            OfferPost.objects.get(pk=1)

class RequestPostsForFeedTest(APITestCase):
    def setUp(self):
        self.user = BasicUser.objects.create_user(username="testuser", email="test@email.com", password="test")
        return self

    def test_request_posts_for_feed_with_no_request_posts(self):
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'r',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 0
        assert response.status_code == 201

    def test_request_posts_for_feed_with_no_offer_posts(self):
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'o',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 0
        assert response.status_code == 201

    def test_request_posts_for_feed_with_1_request_post(self):
        # create one request post
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'r',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 1
        assert response.status_code == 201

    def test_request_posts_for_feed_with_1_offer_post(self):
        # create one offer post
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'o',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 1
        assert response.status_code == 201

    def test_request_posts_for_feed_with_2_request_posts(self):
        # create two request posts
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'r',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 2
        assert response.status_code == 201

    def test_request_posts_for_feed_with_2_offer_posts(self):
        # create two offer posts
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'o',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 2
        assert response.status_code == 201

    def test_request_posts_for_feed_shows_usernames_for_request_posts(self):
        data = create_request_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'r',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 1
        assert response.status_code == 201
        assert json.loads(response.data)[0]['username'] == 'testuser'

    def test_request_posts_for_feed_shows_usernames_for_offer_posts(self):
        data = create_offer_data()
        response = self.client.post(reverse('create_post'), data, format='json')
        assert response.status_code == 201
        
        url = reverse('request_posts_for_feed')
        data = {
            'postType': 'o',
            'postIndex': 0,
        }
        response = self.client.post(url, data, format='json')
        assert len(json.loads(response.data)) == 1
        assert response.status_code == 201
        assert json.loads(response.data)[0]['username'] == 'testuser'