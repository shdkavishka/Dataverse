from django.db import models
from django.contrib.auth.models import AbstractUser

def upload_to(instance,filename):
   return '{filename}'.format(filename=filename)


# Create your models here.

# AH-- my custom user model
class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255, blank=True, default='')
    lastName = models.CharField(max_length=255, blank=True, default='')
    bio = models.CharField(max_length=300, blank=True, default='')
    profilePicture = models.ImageField(default='default.png', upload_to=upload_to)
    gender = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    google_id = models.CharField(max_length=255, blank=True, default='')
    username = None

# AH-- using email to uniquly identify each user
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []