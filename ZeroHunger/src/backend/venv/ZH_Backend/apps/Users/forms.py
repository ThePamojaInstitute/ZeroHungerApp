from django import forms
from .models import BasicUser
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm

class EditProfileForm(forms.ModelForm):
    class Meta:
        model = BasicUser
        fields = ('username','email')

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        try:
            user = BasicUser.objects.exclude(pk=self.instance.pk).get(email=email)
        except BasicUser.DoesNotExist():
            return email
        raise forms.ValidationError("Email is already in use")
    
    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            user = BasicUser.objects.exclude(pk=self.instance.pk).get(username=username)
        except BasicUser.DoesNotExist():
            return username
        raise forms.ValidationError("username is already in use")
    def save(self, commit=True):
        user = super(EditProfileForm, self).save(commit=False)
        user.username = self.cleaned_data['username']
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user   