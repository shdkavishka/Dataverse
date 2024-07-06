from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

def upload_to(instance, filename):
    return '{filename}'.format(filename=filename)

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255, blank=True, default='')
    lastName = models.CharField(max_length=255, blank=True, default='')
    bio = models.CharField(max_length=300, blank=True, default='')
    profilePicture = models.ImageField(default='default.png', upload_to=upload_to, blank=True)
    coverPicture = models.ImageField(default='blank.jpg', upload_to=upload_to, blank=True)
    gender = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    google_id = models.CharField(max_length=255, blank=True, default='')
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

# Ensure you run migrations to reflect the changes in your database
