from django.test import TestCase
from django.test import Client
from apps.Users.models import BasicUser

class TestCasesLogOut(TestCase):
    @classmethod
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_logOut_logged_in(self):
        response = self.client.post('/users/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : 'test@test.com',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)
        response = self.client.post('/users/logIn', 
                                    {
                                    'username' : 'test', 
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)
        response = self.client.post('/users/logOut', {})
        self.assertEqual(response.status_code, 205)

    def test_logOut_not_logged_in(self):
        response = self.client.post('/users/logOut', {})
        self.assertEqual(response.status_code, 400)