# Generated by Django 5.0.6 on 2024-06-18 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='savedchart',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='savedchart',
            name='chart_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='savedchart',
            name='created_by',
            field=models.CharField(max_length=255),
        ),
    ]
