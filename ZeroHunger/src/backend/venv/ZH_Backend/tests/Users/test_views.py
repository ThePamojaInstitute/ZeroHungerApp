from django.test import TestCase
from django.test import Client
from django.urls import reverse
from rest_framework.test import APIClient
from apps.Users.models import BasicUser
import string
import random

#Run all tests with "python manage.py test tests.Users.test_views"
#Run specific test with:
#  "python manage.py test tests.Users.test_views.{class name}.{test name}"

#-------------------------------------------------------------
#General user views unit tests
#-------------------------------------------------------------
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
        response = self.client.post('/users/createUser', 
                                    {
                                        'username' : self.username,
                                        'email' : self.email,
                                        'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)

    def test_createUser_fail(self):
        response = self.client.post('/users/createUser', {})
        self.assertEqual(response.status_code, 401)

    def test_deleteUser_success(self):
        response = self.client.post('/users/createUser',
                                    {
                                        'username': self.username,
                                        'email' : self.email,
                                        'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)
        response = self.client.post('/users/deleteUser', {})
        self.assertEqual(response.status_code, 200)

    def test_deleteUser_fail(self):
        response = self.client.post('/users/deleteUser', {})
        self.assertEqual(response.status_code, 401) #Status 401 on unsuccessful deletion

    #MODIFY USER UNFINISHED
    #Temporary test to check response from modifyUser url
    def test_modifyUser(self):
        response = self.client.post('/users/modifyUser', {})
        # self.assertEqual(response.status_code, 200)

    #Takes in token / username + password
    def test_modifyUser_success(self):
        response = self.client.post('/users/modifyUser', 
                                    {
                                        'username' : self.username,
                                        'password' : self.password
                                    })
        # self.assertEqual(response.status_code, 201) #Status 201 on successful modification (?)

    def test_modifyUser_fail(self):
        response = self.client.post('/users/modifyUser', {})
        # self.assertEqual(response.status_code, 401) #Status 401 on unsuccessful modification

    def test_logIn_success(self):
        #First create new account 
        response = self.client.post('/users/createUser', 
                                    {
                                        'username' : self.username,
                                        'email' : self.email,
                                        'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)
        #Attempt login with credentials
        response = self.client.post('/users/logIn', 
                                    {
                                        'username' : self.username, 
                                        'password' : self.password
                                    })
        self.assertEqual(response.status_code, 201)

    def test_logIn_fail(self):
        response = self.client.post('/users/logIn', 
                                    {
                                        'username' : 'incorrectusername',
                                        'password' : 'incorrectpassword'
                                    })
        self.assertEqual(response.status_code, 401)

#-------------------------------------------------------------
#Create user unit tests
#-------------------------------------------------------------
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

#-------------------------------------------------------------
#Log out unit tests
#-------------------------------------------------------------
# import AsyncStorage from "@react-native-async-storage/async-storage"
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
        response = self.client.post('/users/logOut', 
                                    {
                                        'refresh_token' : 'test'
                                    })
        self.assertEqual(response.status_code, 205)

    def test_logOut_not_logged_in(self):
        response = self.client.post('/users/logOut', {})
        self.assertEqual(response.status_code, 400)

#-------------------------------------------------------------
#Log in unit tests
#-------------------------------------------------------------
class TestCasesLogIn(TestCase):
    @classmethod
    def setUp(self):
        self.client = Client()
        response = self.client.post('/users/createUser', 
                                    {
                                        'username' : 'test',
                                        'email' : 'test@test.com',
                                        'password' : 'test'
                                    })
    
    def tearDown(self):
        pass

    def test_logIn_success(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test',
                                        'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)

    def test_logIn_fail(self):
        response = self.client.post('/users/logIn', {})
        self.assertEqual(response.status_code, 401)

    def test_wrong_username(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test_wrong',
                                        'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_wrong_password(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test',
                                        'password' : 'test_wrong'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_username(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : '',
                                        'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    def test_no_password(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test',
                                        'password' : ''
                                    })
        self.assertEqual(response.status_code, 401)

    def test_logged_in_login(self):
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test',
                                        'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 201)

        #Attempt log in when user is already logged in
        response = self.client.post('/users/logIn',
                                    {
                                        'username' : 'test',
                                        'password' : 'test'
                                    })
        self.assertEqual(response.status_code, 401)

    #SQL injection test

    #Verfify SSL certificate (?)

    #Test number of login attempts