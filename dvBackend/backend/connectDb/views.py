from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from django.http import JsonResponse
import jwt
from .models import ConnectedDatabase
from .serializers import ConnectedDatabaseSerializer
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied
from users.models import User
from rest_framework.exceptions import AuthenticationFailed

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
            user = User.objects.filter(id=payload['id']).first()
            if not user:
                raise AuthenticationFailed('User not found!')
    
        except jwt.ExpiredSignatureError:
            raise PermissionDenied('JWT token expired')
        except jwt.InvalidTokenError:
            raise PermissionDenied('Invalid JWT token')

        # Add user ID to serializer data before saving
        serializer.save(owner=user)
