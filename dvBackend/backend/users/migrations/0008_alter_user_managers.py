from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_user_coverpicture'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
    ]
