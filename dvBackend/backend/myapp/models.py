from django.db import models
from users.models import User
from connectDb.models import ConnectedDatabase

class SavedChart(models.Model):
    chart_name = models.CharField(max_length=255)
    chart_data = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_charts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    database = models.ForeignKey(ConnectedDatabase, on_delete=models.CASCADE, related_name='saved_charts')

    def __str__(self):
        return self.chart_name

 