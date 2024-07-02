from django.db import models
from django.contrib.auth.models import User

class SavedChart(models.Model):
    chart_name = models.CharField(max_length=255)
    chart_data = models.TextField()
    created_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.chart_name
    
    
  
 