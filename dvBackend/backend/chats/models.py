

# Create your models here.
from django.db import models
from django.conf import settings

# NSN - Database model
class Database(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='databases', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    db_user = models.CharField(max_length=255)
    db_password = models.CharField(max_length=255)
    db_host = models.CharField(max_length=255)
    db_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
# NSN - Chat model
class Chat(models.Model):
    database = models.ForeignKey(Database, related_name='chats', on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
# NSN - Message model
class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    prompt = models.TextField()
    query = models.TextField()
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message in {self.chat.title}"