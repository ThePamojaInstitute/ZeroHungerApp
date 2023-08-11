from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZH_Backend.settings')

app = Celery( 'ZH_Backend',
               broker='redis://localhost:6379/0',
               backend='redis://localhost:6379/0'
            )

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.timezone = 'America/Toronto'

app.conf.beat_schedule = {
    'delete_expired_posts': {
        'task': 'apps.Posts.tasks.delete_expired_posts', # name of task with path
        'schedule': crontab(hour=0, minute=0), # crontab() runs the tasks at 12:00 am every day 
    },
}

# Load task modules from all registered Django apps.
app.autodiscover_tasks()