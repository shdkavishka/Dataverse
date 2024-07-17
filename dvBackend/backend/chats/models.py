from django.db import models

# Create your models here.


# Create your models here.
from django.db import models
from django.conf import settings
from connectDb.models import ConnectedDatabase


    
# NSN - Chat model
class Chat(models.Model):
    database = models.ForeignKey(ConnectedDatabase, related_name='chats', on_delete=models.CASCADE)
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