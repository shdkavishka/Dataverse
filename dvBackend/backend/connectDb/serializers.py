from rest_framework import serializers
from .models import ConnectedDatabase

class ConnectedDatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedDatabase
        fields = ['id', 'name', 'server', 'database', 'user', 'password', 'owner']
