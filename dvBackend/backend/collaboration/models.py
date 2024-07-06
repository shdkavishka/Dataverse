from django.db import models
from django.conf import settings
from connectDb.models import ConnectedDatabase 

# Create your models here.

class Collaboration(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='collaborations', on_delete=models.CASCADE)
    database = models.ForeignKey(ConnectedDatabase, related_name='collaborations', on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('user', 'database')

    def __str__(self):
        return f"{self.user.name} - {self.database.name}"