from django.db import models
from apps.Users.models import BasicUser
import uuid


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    user1 = models.ForeignKey(
        BasicUser, on_delete=models.CASCADE, related_name="user1", blank=True, null=True
    )
    user2 = models.ForeignKey(
        BasicUser, on_delete=models.CASCADE, related_name="user2", blank=True, null=True
    )
    sentPhoneNum = models.BooleanField(default = False)
    sentEmail = models.BooleanField(default = False)
    user1Muted = models.BooleanField(default = False)
    user2Muted = models.BooleanField(default = False)
    user1SentOwnEmail = models.BooleanField(default = False)
    user2SentOwnEmail = models.BooleanField(default = False)

    def __str__(self):
        return f"{self.name}"
    
    def save(self, *args, **kwargs):
        usernames = self.name.split("__")
        users = []

        for username in usernames:
            try:
                user = BasicUser.objects.get(username=username)
                users.append(user)
            except Exception as e:
                users.append(None)

        try:
            self.user1 = users[0]
            self.user2 = users[1]
        except Exception as e:
            print(e)
            pass

        super(Conversation, self).save(*args, **kwargs)


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    from_user = models.ForeignKey(
        BasicUser, on_delete=models.CASCADE, related_name="messages_from_me"
    )
    to_user = models.ForeignKey(
        BasicUser, on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.from_user.username} to {self.to_user.username}: {self.content} [{self.timestamp}]"
    
    @property
    def from_user_profile(self):
        from_user_profile = BasicUser.objects.get(username = self.from_user)
        return from_user_profile
    
    @property
    def to_user_profile(self):
        to_user_profile = BasicUser.objects.get(username = self.to_user)
        return to_user_profile