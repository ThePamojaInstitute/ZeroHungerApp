from django.test import TestCase
from django.test import Client

#Run with python manage.py test tests.test_cases_createUser

class TestCasesCreateUser(TestCase):
    @classmethod
    def setUp(self):
        self.client = Client()
        self.url = '/users/createUser'

    def tearDown(self):
        pass

    def test_success(self):
        response = self.client.post(self.url, 
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 201)

    def test_no_username(self):
        response = self.client.post(self.url, 
                                    {
                                        'username' : '',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_email(self):
        response = self.client.post(self.url, 
                                    {
                                        'username' : 'test',
                                        'email' : '',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_password(self):
        response = self.client.post(self.url, 
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : ''
                                    })
        self.assertEqual(response.status_code, 401)

    def test_malformed_email(self):
        response = self.client.post(self.url, 
                                    {
                                        'username' : 'test',
                                        'email' : 'test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_username_with_spaces(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'te s t',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_email_with_spaces(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 't e s t @tes t.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_email_with_special_chars(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : '~!#$%^&*()[]}{-.@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_email_with_periods(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test.test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 201)

    def test_email_with_multiple_address_signs(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 't@st@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_password_with_spaces(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'te s tte st'
                                    })
        self.assertEqual(response.status_code, 401)

    #Password is less than 8 characters test
    def test_short_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 't'
                                    })
        self.assertEqual(response.status_code, 401)

    #Password has one uppercase letter test
    def test_one_uppercase_letter_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'Testtest'
                                    })
        self.assertEqual(response.status_code, 201)

    #Password has one lowercase letter test
    def test_one_lowercase_letter_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'TESTTESt'
                                    })
        self.assertEqual(response.status_code, 201)

    #Passsword has one number test
    def test_one_number_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest1'
                                    })
        self.assertEqual(response.status_code, 201)

    #Password has one special character test
    def test_one_special_char_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest!'
                                    })
        self.assertEqual(response.status_code, 201)

    #Password is not the same as username test
    def test_username_same_as_password(self):
        response = self.client.post(self.url,
                                    {
                                        'username' : 'testtest',
                                        'email' : 'test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    #Password and confirm password fields match test

    #Extremely long username/email/password test

    #SQL injection test

    #Profanity filter test