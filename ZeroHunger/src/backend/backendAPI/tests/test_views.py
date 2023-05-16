from django.test import TestCase
from django.test import Client
from django.urls import reverse
from rest_framework.test import APIClient
from backendAPI.models import BasicUser

#Run tests with "python manage.py test backendAPI.test_views"

class TestViews(TestCase):
    @classmethod
    def setUp(self):
        self.client = Client()
        self.username = 'test'
        self.email = 'test@test.com'
        self.password = 'test123'

    def tearDown(self):
        pass

    def test_createUser_success(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : self.username,
                                    'email' : self.email,
                                    'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)

    def test_createUser_fail(self):
        response = self.client.post('/api/createUser', {})
        self.assertEqual(response.status_code, 401)

    #View unfinished
    #Temporary test to check response from deleteUser url
    def test_deleteUser(self):
        response = self.client.post('/api/deleteUser', {})
        self.assertNotEqual(response.content, 404)

    #View unfinished
    #Takes in token / username + password
    def test_deleteUser_success(self):
        response = self.client.post('/api/deleteUser', 
                                    {
                                    'username' : self.username,
                                    'password' : self.password
                                    })
        # print(response.content)
        self.assertEqual(response.status_code, 201) #Status 201 on successful deletion (?)

    #View unfinished
    def test_deleteUser_fail(self):
        response = self.client.post('/api/deleteUser', {})
        self.assertEqual(response.status_code, 401) #Status 401 on unsuccessful deletion

    #View unfinished
    #Temporary test to check response from modifyUser url
    def test_modifyUser(self):
        response = self.client.post('/api/modifyUser', {})
        self.assertEqual(response.status_code, 200)

    #View unfinished
    #Takes in token / username + password
    def test_modifyUser_success(self):
        response = self.client.post('/api/modifyUser', 
                                    {
                                    'username' : self.username,
                                    'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201) #Status 201 on successful modification (?)

    #View unfinished
    def test_modifyUser_fail(self):
        response = self.client.post('/api/modifyUser', {})
        self.assertEqual(response.status_code, 401) #Status 401 on unsuccessful modification

    def test_logIn_success(self):
        #First create new account 
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : self.username,
                                    'email' : self.email,
                                    'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)
        #Attempt login with credentials
        response = self.client.post('/api/logIn', 
                                    {
                                    'username' : self.username, 
                                    'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)

    def test_logIn_fail(self):
        response = self.client.post('/api/logIn', 
                                    {
                                    'username' : self.username,
                                    'password' : self.password
                                    })
        self.assertEqual(response.status_code, 401)
    
    #Doesn't work
    def test_logOut_success(self):
        user = BasicUser.objects.create(username='admin', password='pass@123', email='admin@admin.com')
        self.client.force_login(user)
        response = self.client.logout()
        self.assertEqual(response, 205)

    def test_logOut_fail(self):
        response = self.client.post('/api/logOut', {})
        self.assertEqual(response.status_code, 400)