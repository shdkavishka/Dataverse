# Generated by Django 5.0.4 on 2024-07-03 14:13

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_user_profilepicture'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='coverPicture',
            field=models.ImageField(blank=True, default='blank.jpg', upload_to=users.models.upload_to),
        ),
    ]