from django.test import TestCase
from django.test import Client
import string
import random

#Run with python manage.py test tests.Users.test_cases_createUser
#Run individual test with:
# "python manage.py test tests.Users.test_cases_createUser.TestCasesCreateUser.{test name}"

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

    #Discuss if spaced username ok
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

    #Extremely long username/email/password test
    def test_extremely_long_username(self):
        #1000 character long username
        username = ''.join(random.choice(string.ascii_letters) for i in range(1000))
        response = self.client.post(self.url,
                                    {
                                        'username' : username,
                                        'email' : 'test@test.com',
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    #Extremely long email test
    def test_extremely_long_email(self):
        #1000 character long email
        email = ''.join(random.choice(string.ascii_letters) for i in range(1000))
        email = email.join('@xyz.com')
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : email,
                                        'password' : 'testtest'
                                    })
        self.assertEqual(response.status_code, 401)

    #Extremely long password test
    def test_extremely_long_password(self):
        #1000 character long password
        password = ''.join(random.choice(string.ascii_letters) for i in range(1000))
        response = self.client.post(self.url,
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : password
                                    })
        self.assertEqual(response.status_code, 401)

    #SQL injection test

    #Profanity filter test