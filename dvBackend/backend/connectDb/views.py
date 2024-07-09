from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from django.http import JsonResponse
import jwt
from .models import ConnectedDatabase
from .serializers import ConnectedDatabaseSerializer
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied, ValidationError
from users.models import User as CustomUser
from rest_framework.exceptions import AuthenticationFailed
import pyodbc

# Function to validate database credentials
def validate_database_credentials(server, database, username, password):
    try:
        # Establish a connection to SQL Server using pyodbc
        conn = pyodbc.connect(
            f'DRIVER=ODBC Driver 17 for SQL Server;'
            f'SERVER={server};'
            f'DATABASE={database};'
            f'UID={username};'
            f'PWD={password};'
        )
        conn.close()
        return True  # Credentials are correct
    except pyodbc.Error as e:
        print(f"Error validating credentials: {str(e)}")
        return False  # Credentials are incorrect

# View for creating and listing connected databases
class ConnectedDatabaseListCreate(ListCreateAPIView):
    queryset = ConnectedDatabase.objects.all()
    serializer_class = ConnectedDatabaseSerializer

    def get_queryset(self):
        # Extract user ID from JWT token
        token = self.request.COOKIES.get('jwt')
        if not token:
            raise PermissionDenied('JWT token not provided')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user_id = payload['id']
        except jwt.ExpiredSignatureError:
            raise PermissionDenied('JWT token expired')
        except jwt.InvalidTokenError:
            raise PermissionDenied('Invalid JWT token')

        return ConnectedDatabase.objects.filter(owner_id=user_id)

    def perform_create(self, serializer):
        # Extract user ID from JWT token
        token = self.request.COOKIES.get('jwt')
        if not token:
            raise PermissionDenied('JWT token not provided')

        try:
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
            user = CustomUser.objects.filter(id=payload['id']).first()
            if not user:
                raise AuthenticationFailed('User not found!')
    
        except jwt.ExpiredSignatureError:
            raise PermissionDenied('JWT token expired')
        except jwt.InvalidTokenError:
            raise PermissionDenied('Invalid JWT token')

        # Validate database connection with provided credentials
        name = serializer.validated_data.get('name')
        server = serializer.validated_data.get('server')
        database = serializer.validated_data.get('database')
        username = serializer.validated_data.get('user')
        password = serializer.validated_data.get('password')

        # Example of a function to validate credentials (using pyodbc for SQL Server)
        if not validate_database_credentials(server, database, username, password):
            raise ValidationError('Database credentials are incorrect.')

        # Add user ID to serializer data before saving
        serializer.save(owner=user)
