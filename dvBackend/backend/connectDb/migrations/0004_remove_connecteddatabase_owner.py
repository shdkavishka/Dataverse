# Generated by Django 5.0.6 on 2024-07-07 06:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connectDb', '0003_connecteddatabase_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='connecteddatabase',
            name='owner',
        ),
    ]
