# Generated by Django 5.0.4 on 2024-07-10 02:49

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('connectDb', '0002_initial'),
        ('myapp', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='savedchart',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_charts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='savedchart',
            name='database',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_charts', to='connectDb.connecteddatabase'),
        ),
    ]
