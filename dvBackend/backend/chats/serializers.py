
from rest_framework import serializers
from .models import Chat, Message

# NSN - Serializer for handling user prompts
class SQLQuerySerializer(serializers.Serializer):
    db_user = serializers.CharField(max_length=100)  
    db_password = serializers.CharField(max_length=100)  
    db_host = serializers.CharField(max_length=100)  
    db_name = serializers.CharField(max_length=100)  
    prompt = serializers.CharField(max_length=500)  

class MessageSerializer(serializers.ModelSerializer):
    chat = serializers.PrimaryKeyRelatedField(queryset=Chat.objects.all())  

    class Meta:
        model = Message
        fields = ['id', 'chat', 'prompt', 'query', 'result']  

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    database = serializers.StringRelatedField() 

    class Meta:
        model = Chat
        fields = ['id', 'title', 'messages', 'database']
