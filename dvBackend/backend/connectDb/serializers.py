# data_analysis/serializers.py
from rest_framework import serializers
from .models import ConnectedDatabase, DataAnalysisResult


class ConnectedDatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedDatabase
        fields = '__all__'
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

class DataAnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataAnalysisResult
        fields = '__all__'