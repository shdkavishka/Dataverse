from django.db import models

def upload_to(instance, filename):
    return '{filename}'.format(filename=filename)

class Feedback(models.Model):
    question = models.TextField()
    answer_query = models.TextField()
    chart_image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    reaction = models.CharField(max_length=15, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.question
