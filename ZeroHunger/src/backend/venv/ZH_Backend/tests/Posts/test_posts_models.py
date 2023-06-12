import pytest
from datetime import datetime
from django.db import IntegrityError
from apps.Posts.models import OfferPost, RequestPost


@pytest.mark.django_db
def test_create_OfferPost():
    date_now = datetime.now().timestamp()

    offer_post = OfferPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="o"
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Test Title'
    assert offer_post_db.images == 'testImageLink'
    assert offer_post_db.postedOn == int(date_now)
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == 'test description'
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost():
    date_now = datetime.now().timestamp()

    request_post = RequestPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="r"
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Test Title'
    assert request_post_db.images == 'testImageLink'
    assert request_post_db.postedOn == int(date_now)
    assert request_post_db.postedBy == 0
    assert request_post_db.description == 'test description'
    assert request_post_db.postType == "r"

@pytest.mark.django_db
def test_create_OfferPost_without_title():
    date_now = datetime.now().timestamp()

    offer_post = OfferPost.objects.create(
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="o"
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Untitled'
    assert offer_post_db.images == 'testImageLink'
    assert offer_post_db.postedOn == int(date_now)
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == 'test description'
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost_without_title():
    date_now = datetime.now().timestamp()

    request_post = RequestPost.objects.create(
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="r"
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Untitled'
    assert request_post_db.images == 'testImageLink'
    assert request_post_db.postedOn == int(date_now)
    assert request_post_db.postedBy == 0
    assert request_post_db.description == 'test description'
    assert request_post_db.postType == "r"

@pytest.mark.django_db
def test_create_OfferPost_without_images():
    date_now = datetime.now().timestamp()

    offer_post = OfferPost.objects.create(
        title="Test Title",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="o"
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Test Title'
    assert offer_post_db.images == 'linkToImageDB'
    assert offer_post_db.postedOn == int(date_now)
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == 'test description'
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost_without_images():
    date_now = datetime.now().timestamp()

    request_post = RequestPost.objects.create(
        title="Test Title",
        postedOn=date_now,
        postedBy=0,
        description="test description",
        postType="r"
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Test Title'
    assert request_post_db.images == 'linkToImageDB'
    assert request_post_db.postedOn == int(date_now)
    assert request_post_db.postedBy == 0
    assert request_post_db.description == 'test description'
    assert request_post_db.postType == "r"

@pytest.mark.django_db
def test_create_OfferPost_without_postedOn():
    offer_post = OfferPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedBy=0,
        description="test description",
        postType="o"
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Test Title'
    assert offer_post_db.images == 'testImageLink'
    assert offer_post_db.postedOn == 1
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == 'test description'
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost_without_postedOn():
    request_post = RequestPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedBy=0,
        description="test description",
        postType="r"
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Test Title'
    assert request_post_db.images == 'testImageLink'
    assert request_post_db.postedOn == 1
    assert request_post_db.postedBy == 0
    assert request_post_db.description == 'test description'
    assert request_post_db.postType == "r"

@pytest.mark.django_db
def test_create_OfferPost_without_postedBy():
    date_now = datetime.now().timestamp()

    with pytest.raises(IntegrityError):
        OfferPost.objects.create(
            title="Test Title",
            images="testImageLink",
            postedOn=date_now,
            description="test description",
            postType="o"
        )

@pytest.mark.django_db
def test_create_RequestPost_without_PostedBy():
    date_now = datetime.now().timestamp()

    with pytest.raises(IntegrityError):
        RequestPost.objects.create(
            title="Test Title",
            images="testImageLink",
            postedOn=date_now,
            description="test description",
            postType="r"
        )

@pytest.mark.django_db
def test_create_OfferPost_without_description():
    date_now = datetime.now().timestamp()

    offer_post = OfferPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        postType="o"
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Test Title'
    assert offer_post_db.images == 'testImageLink'
    assert offer_post_db.postedOn == int(date_now)
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == ''
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost_without_description():
    date_now = datetime.now().timestamp()

    request_post = RequestPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        postType="r"
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Test Title'
    assert request_post_db.images == 'testImageLink'
    assert request_post_db.postedOn == int(date_now)
    assert request_post_db.postedBy == 0
    assert request_post_db.description == ''
    assert request_post_db.postType == "r"

@pytest.mark.django_db
def test_create_OfferPost_without_postType():
    date_now = datetime.now().timestamp()

    offer_post = OfferPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
    )

    offer_post_db = OfferPost.objects.get(id=offer_post.id)
        
    assert offer_post_db.title =='Test Title'
    assert offer_post_db.images == 'testImageLink'
    assert offer_post_db.postedOn == int(date_now)
    assert offer_post_db.postedBy == 0
    assert offer_post_db.description == 'test description'
    assert offer_post_db.postType == "o"

@pytest.mark.django_db
def test_create_RequestPost_without_postType():
    date_now = datetime.now().timestamp()

    request_post = RequestPost.objects.create(
        title="Test Title",
        images="testImageLink",
        postedOn=date_now,
        postedBy=0,
        description="test description",
    )

    request_post_db = RequestPost.objects.get(id=request_post.id)
        
    assert request_post_db.title =='Test Title'
    assert request_post_db.images == 'testImageLink'
    assert request_post_db.postedOn == int(date_now)
    assert request_post_db.postedBy == 0
    assert request_post_db.description == 'test description'
    assert request_post_db.postType == "r"
