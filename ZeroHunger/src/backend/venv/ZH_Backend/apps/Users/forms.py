from django import forms
from .models import BasicUser
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm

class EditProfileForm(forms.ModelForm):
    class Meta:
        model = BasicUser
        fields = ('username','email')
    # def clean_username(self):
    #     username = self.cleaned_data['username']
    #     try:
    #         user = BasicUser.objects.exclude(pk=self.instance.pk).get(username=username)
    #     except BasicUser.DoesNotExist:
    #         return username
    #     raise forms.ValidationError('Username "%s" is already in use' % username)
    
    def save(self, commit=True):
        user = super(EditProfileForm, self).save(commit=False)
        user.username = self.data['username']
        user.email = self.data['email']
        print(user)
        # if commit:
        #     user.save()
        # return user

    username = forms.CharField(max_length=100, required=True,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(required=True,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
   