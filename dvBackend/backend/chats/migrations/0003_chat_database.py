# Generated by Django 5.0.4 on 2024-07-01 09:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0002_rename_timestamp_message_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='database',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='chats', to='chats.database'),
        ),
    ]