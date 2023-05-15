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


from .views import createUser, deleteUser, modifyUser, logIn, logOut, MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls ), 
    path('api/createUser', createUser.as_view()),
    path('api/deleteUser', deleteUser.as_view()),
    path('api/modifyUser', modifyUser.as_view()),
    path('api/logIn', logIn.as_view()),
    path('api/logOut', logOut.as_view()),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/',
         auth_views.PasswordResetView.as_view(
             template_name='templates/password-reset/password_reset_form.html',
             subject_template_name='templates/password-reset/password_reset_subject.txt',
             email_template_name='templates/password-reset/password_reset_email.html',
             # success_url='/login/'
         ),
         name='password_reset'),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='templates/password-reset/password_reset_done.html'
         ),
         name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='templates/password-reset/password_reset_confirm.html'
         ),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='templates/password-reset/password_reset_complete.html'
         ),
         name='password_reset_complete'),
]
