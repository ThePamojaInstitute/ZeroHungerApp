from django import forms
from .models import BasicUser
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm

class EditProfileForm(forms.ModelForm):
    username = forms.CharField(max_length=100, required=True,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(required=True,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(max_length=64) 
    class Meta:
        model = BasicUser
        fields = ('username',
                 'email',
                 'password')
