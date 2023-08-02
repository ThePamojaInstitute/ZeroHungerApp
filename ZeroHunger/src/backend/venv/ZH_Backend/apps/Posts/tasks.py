from ZH_Backend.celery import app
from .models import RequestPost, OfferPost
from datetime import datetime

@app.task
def delete_expired_posts():
    print(" task called and worker is running good")

    RequestPost.objects.filter(expiryDate__lt=datetime.now()).delete()
    OfferPost.objects.filter(expiryDate__lt=datetime.now()).delete()

    return "successfully deleted expired posts"
