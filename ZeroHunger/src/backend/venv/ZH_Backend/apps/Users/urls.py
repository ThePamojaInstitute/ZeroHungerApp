"""backendAPI URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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

from django.contrib.auth.views import ( #default django password reset views, probably change later
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

from django.contrib.auth import views as auth_views



from django.urls import path
from rest_framework_simplejwt import views as jwt_views


from .views import (
    createUser, 
    deleteUser, 
    modifyUser, 
    logIn, 
    logOut, 
    MyTokenObtainPairView, 
    getNotifications,
    addNotification,
    clearNotification,
    clearAllNotifications, 
    userPreferences,
    EditUser
)

urlpatterns = [
    path('createUser', createUser.as_view()),
    path('deleteUser', deleteUser.as_view()),
    path('modifyUser', modifyUser.as_view()),
    path('logIn', logIn.as_view()),
    path('logOut', logOut.as_view()),
    path('editUser', EditUser.as_view()), 
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('getNotifications', getNotifications.as_view()),
    path('addNotification', addNotification.as_view()),
    path('clearNotification', clearNotification.as_view()),
    path('clearAllNotifications', clearAllNotifications.as_view()),
      # Password reset links (ref: https://github.com/django/django/blob/master/django/contrib/auth/views.py)
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="password_reset/password_reset.html"), name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="password_reset/password_reset_done.html"), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="password_reset/password_reset_confirm.html"), name="password_reset_confirm"),
    path('reset_password_complete', auth_views.PasswordResetCompleteView.as_view(template_name="password_reset/password_reset_complete.html"), name="password_reset_complete"),
    path('userPreferences', userPreferences.as_view()),
]
