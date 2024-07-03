from django.db import models
from django.core.exceptions import ValidationError
from users.models import User
import json

class SavedChart(models.Model):
    chart_name = models.CharField(max_length=255)
    chart_data = models.TextField()  # LONGBLOB in MySQL can be mapped to TextField in Django
    chart_image = models.ImageField(upload_to='charts/', blank=True, null=True )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

  #  def __str__(self):
   #     return self.chart_name
    
    
    def clean(self):
        # Validate chart_data is a valid JSON string
        try:
            chart_data_dict = json.loads(self.chart_data)
            if not isinstance(chart_data_dict, dict) or 'type' not in chart_data_dict or 'data' not in chart_data_dict:
                raise ValidationError('Invalid chart data format')
        except json.JSONDecodeError:
            raise ValidationError('Invalid JSON format for chart data')

    def save(self, *args, **kwargs):
        self.clean()  # Call clean method to validate before saving
        super(SavedChart, self).save(*args, **kwargs)   
    
