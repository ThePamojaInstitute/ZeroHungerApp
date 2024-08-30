from django.contrib import admin
from django.apps import apps

from apps.Users.models import BasicUser, PublicKey
from apps.Posts.models import OfferPost, RequestPost

admin.site.register(RequestPost)
admin.site.register(OfferPost)
admin.site.register(BasicUser)
admin.site.register(PublicKey)