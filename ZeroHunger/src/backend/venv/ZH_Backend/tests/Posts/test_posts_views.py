from django.urls import reverse
from rest_framework.test import APITestCase
import json


def create_request_data():
    return {
        'postData': {
            'title' : "Test Title",
            'images' : "testImageLink",
            'postedOn': 1,
            'postedBy' : 0,
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
            'postedBy' : 0,
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
        print(response.content)
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

# TODO
# class DeletePostTestCase(APITestCase):
#     def test_delete_post(self):

class RequestPostsForFeedTest(APITestCase):
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