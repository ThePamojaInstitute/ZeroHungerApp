import pytest
from apps.Posts.serializers import createRequestSerializer, createOfferSerializer
from apps.Posts.models import OfferPost, RequestPost


@pytest.mark.django_db
def test_create_request_serializer():
    data = {
        'title': 'Test Request',
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test request.',
    }
    serializer = createRequestSerializer(data=data)
    assert serializer.is_valid()
    serializer.save()

    # Verify that a RequestPost object was created
    assert RequestPost.objects.filter(title='Test Request').exists()

@pytest.mark.django_db
def test_create_offer_serializer():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createOfferSerializer(data=data)
    assert serializer.is_valid()
    serializer.save()

    # Verify that an OfferPost object was created
    assert OfferPost.objects.filter(title='Test Offer').exists()

def test_create_request_serializer_without_title():
    data = {
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createRequestSerializer(data=data)
    assert not serializer.is_valid()

def test_create_offer_serializer_without_title():
    data = {
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createOfferSerializer(data=data)
    assert not serializer.is_valid()

def test_create_request_serializer_without_images():
    data = {
        'title': 'Test Offer',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createRequestSerializer(data=data)
    assert serializer.is_valid()

def test_create_offer_serializer_without_images():
    data = {
        'title': 'Test Offer',
        'postedOn': 1,
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createOfferSerializer(data=data)
    assert serializer.is_valid()

def test_create_request_serializer_without_postedOn():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createRequestSerializer(data=data)
    assert not serializer.is_valid()

def test_create_offer_serializer_without_postedOn():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedBy': 1,
        'description': 'This is a test offer.',
    }
    serializer = createOfferSerializer(data=data)
    assert not serializer.is_valid()

def test_create_request_serializer_without_postedBy():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedOn': 1,
        'description': 'This is a test offer.',
    }
    serializer = createRequestSerializer(data=data)
    assert not serializer.is_valid()

def test_create_offer_serializer_without_postedBy():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedOn': 1,
        'description': 'This is a test offer.',
    }
    serializer = createOfferSerializer(data=data)
    assert not serializer.is_valid()

def test_create_request_serializer_without_description():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
    }
    serializer = createRequestSerializer(data=data)
    assert serializer.is_valid()

def test_create_offer_serializer_without_description():
    data = {
        'title': 'Test Offer',
        'images': 'image.jpg',
        'postedOn': 1,
        'postedBy': 1,
    }
    serializer = createOfferSerializer(data=data)
    assert serializer.is_valid()