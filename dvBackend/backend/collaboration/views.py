from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Collaboration
from connectDb.models import ConnectedDatabase
from .serializers import CollaborationSerializer
from rest_framework.exceptions import AuthenticationFailed
import jwt
from users.serializers import UserSerializer
from users.models import User
from connectDb.serializers import ConnectedDatabaseSerializer
from connectDb.models import ConnectedDatabase
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.exceptions import AuthenticationFailed
import jwt
from users.models import User
from myapp.models import SavedChart



class InviteCollaboratorView(APIView):

    def post(self, request):
        # Extract the token from cookies in the request
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Retrieve the user from the database
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        database_id = request.data.get('database_id')
        invitee_email = request.data.get('email')

        # Ensure the database belongs to the logged-in user
        database = get_object_or_404(ConnectedDatabase, id=database_id, owner=user)
        
        # Check if the invitee is a valid user
        invitee = get_object_or_404(User, email=invitee_email)

        confirmation_url = f"{settings.FRONTEND_BASE_URL}/confirm-collaboration/{database.id}/{invitee.id}/{user.id}"
        
        send_mail(
            'Collaboration Invitation',
            f'You have been invited by {user.email} to collaborate on the database {database.name}. Click the link to confirm: {confirmation_url}',
            settings.DEFAULT_FROM_EMAIL,
            [invitee_email],
        )

        return Response({'message': 'Invitation sent'}, status=status.HTTP_200_OK)


class ConfirmCollaborationView(APIView):

    def post(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Retrieve the user from the database
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        user_id = request.data.get('user_id')
        database_id = request.data.get('database_id')

        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not database_id:
            return Response({'error': 'Database ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        database = get_object_or_404(ConnectedDatabase, id=database_id)

        collaboration, created = Collaboration.objects.get_or_create(user=user, database=database)

        if created:
            return Response({'message': 'Collaboration confirmed'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Collaboration already exists'}, status=status.HTTP_200_OK)
        

class UserCollaborationsView(APIView):
    def get(self, request):
        # Extract the token from cookies in the request
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Retrieve the user from the database
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        # Get all collaborations for the user
        collaborations = Collaboration.objects.filter(user=user)
        
        # Get only the IDs of collaborations
        collaboration_ids = list(collaborations.values_list('database_id', flat=True))
        
        return Response(collaboration_ids, status=status.HTTP_200_OK)
    
class DatabaseCollaboratorsView(APIView):

    def post(self, request):
        # Extract the token from cookies in the request
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Retrieve the user from the database
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        # Extract database_id from the request body
        database_id = request.data.get('database_id')
        if not database_id:
            return Response({'error': 'Database ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the database exists
        database = get_object_or_404(ConnectedDatabase, id=database_id)

        # Get all collaborations for the database
        collaborations = Collaboration.objects.filter(database=database)

        # Get all users from the collaborations
        users = [collaboration.user for collaboration in collaborations]

        # Serialize the users
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    


class DatabaseDetailView(APIView):
    def get(self, request, *args, **kwargs):
        database_id = kwargs.get('pk')
        try:
            database = ConnectedDatabase.objects.get(pk=database_id)
            serializer = ConnectedDatabaseSerializer(database)
            return Response(serializer.data)
        except ConnectedDatabase.DoesNotExist:
            return Response({"error": "Database not found"}, status=status.HTTP_404_NOT_FOUND)
        


class GetCollaboratorChartsView(APIView):

    @method_decorator(csrf_exempt)
    def get(self, request, user_id):
        try:
            # Extract the token from cookies in the request
            token = request.COOKIES.get('jwt')

            if not token:
                raise AuthenticationFailed('Unauthenticated!')

            try:
                # Decode JWT token
                payload = jwt.decode(token, key='secret', algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated!')

            # Retrieve the user from the database
            authenticated_user = User.objects.filter(id=payload['id']).first()
            if not authenticated_user:
                raise AuthenticationFailed('Unauthenticated!')

            # Get the external user by user_id
            external_user = User.objects.get(id=user_id)

            # Get the databases where the logged-in user is a collaborator
            user_collaborations = Collaboration.objects.filter(user=authenticated_user)
            collaborator_databases = ConnectedDatabase.objects.filter(id__in=user_collaborations.values('database_id'))

            # Get the saved charts created by the external user from these databases
            charts = SavedChart.objects.filter(created_by=external_user, database__in=collaborator_databases)
            chart_list = list(charts.values('id', 'chart_name', 'chart_data', 'created_at', 'updated_at', 'database_id'))

            return JsonResponse({'charts': chart_list}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except AuthenticationFailed as e:
            return JsonResponse({'error': str(e)}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)