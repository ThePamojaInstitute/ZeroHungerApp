#Run with "python manage.py test"

from django.test import TestCase

class Test(TestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        pass

    def test0(self):
        self.assertFalse(False)

    def test1(self):
        self.assertTrue(True)

    def test2(self):
        self.assertFalse(True)