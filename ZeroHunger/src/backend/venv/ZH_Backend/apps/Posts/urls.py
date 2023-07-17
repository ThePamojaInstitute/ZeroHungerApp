"""
URL configuration for posts project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from .views import createPost, requestPostsForFeed, deletePost, postsHistory, markAsFulfilled

urlpatterns = [
    path('createPost', createPost.as_view(), name='create_post'),
    path('deletePost', deletePost.as_view(), name='delete_post'),
    path('requestPostsForFeed', requestPostsForFeed.as_view(), name='request_posts_for_feed'),
    path('postsHistory', postsHistory.as_view(), name='posts_history'),
    path('markAsFulfilled', markAsFulfilled.as_view(), name='mark_as_fulfilled'),
]
