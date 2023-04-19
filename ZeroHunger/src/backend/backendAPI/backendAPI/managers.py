from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError(_("Email Must Be Set"))
        email = self.normalize_email(email)
        username = self.get_by_natural_key(username)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
