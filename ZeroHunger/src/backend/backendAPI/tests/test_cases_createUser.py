from django.test import TestCase
from django.test import Client

class TestCasesCreateUser(TestCase):
    @classmethod
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_success(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : 'test@test.com',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)

    def test_no_username(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : '',
                                    'email' : 'test@test.com',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_email(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : '',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_password(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : 'test@test.com',
                                    'password' : ''
                                    })
        self.assertEqual(response.status_code, 401)

    def test_malformed_email(self):
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : 'test.com',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)