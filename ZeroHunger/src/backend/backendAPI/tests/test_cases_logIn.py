from django.test import TestCase
from django.test import Client

class TestCasesLogIn(TestCase):
    @classmethod
    def setUp(self):
        self.client = Client()
        response = self.client.post('/api/createUser', 
                                    {
                                    'username' : 'test',
                                    'email' : 'test@test.com',
                                    'password' : 'test'
                                    })
    
    def tearDown(self):
        pass

    def test_logIn_success(self):
        response = self.client.post('/api/logIn',
                                    {
                                    'username' : 'test',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)

    def test_logIn_fail(self):
        response = self.client.post('/api/logIn', {})
        self.assertEqual(response.status_code, 401)

    def test_wrong_username(self):
        response = self.client.post('/api/logIn',
                                    {
                                    'username' : 'test_wrong',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_wrong_password(self):
        response = self.client.post('/api/logIn',
                                    {
                                    'username' : 'test',
                                    'password' : 'test_wrong'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_username(self):
        response = self.client.post('/api/logIn',
                                    {
                                    'username' : '',
                                    'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_password(self):
        response = self.client.post('/api/logIn',
                                    {
                                    'username' : 'test',
                                    'password' : ''
                                    })
        self.assertEqual(response.status_code, 401)

    #SQL injection test

    #Extremely long username or password test