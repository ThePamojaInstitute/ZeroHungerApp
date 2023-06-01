from rest_framework.exceptions import AuthenticationFailed
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.conf import settings
import jwt


class TokenAuthentication:
    # Users are authenticated by passing the token key in the query parameters.
    # For example:
    #   ?token=401f7ac837da42b97f613d789819ff93537bee6a

    def authenticate_credentials(self, token):
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY)
        except:
            raise AuthenticationFailed("Invalid token.")

        return decoded_token

@database_sync_to_async
def get_user(scope):
    from django.contrib.auth.models import AnonymousUser

    if "token" not in scope:
        raise ValueError(
            "Cannot find token in scope. You should wrap your consumer in "
            "TokenAuthMiddleware."
        )
    token = scope["token"]
    user = None
    try:
        auth = TokenAuthentication()
        user = auth.authenticate_credentials(token)
    except AuthenticationFailed:
        pass
    return user or AnonymousUser()


class TokenAuthMiddleware:
    # Custom middleware that takes a token from the query string and authenticates via Django Rest Framework authtoken.

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params["token"][0]
        scope["token"] = token
        scope["user"] = await get_user(scope)
        return await self.app(scope, receive, send)