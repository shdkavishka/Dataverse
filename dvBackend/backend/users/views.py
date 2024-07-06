from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer,ResetPasswordSerializer,ResetPasswordConfirmSerializer,GoogleUserSerializer
from .models import User
import jwt, datetime
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
import json
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from django.utils.http import urlsafe_base64_decode
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework.exceptions import NotFound

# Create your views here.
#AH-- Register new user
class RegisterView(APIView):
    def post(self, request):
        #AH-- Extract email and password from request data
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #AH-- Save the validated data, including hashing the password
        user = serializer.save()

        #AH-- Prepare payload for JWT token
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        #AH-- Create JWT token
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response({
            'user': serializer.data,
            'jwt': token
        }, status=status.HTTP_201_CREATED)

        #AH-- Set the token in the response cookies
        response.set_cookie(key='jwt', value=token, httponly=True)

        return response

#AH-- Handle user login
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email).first()

        #AH-- check/verify them
        if user is None:
            return Response({'error': 'User not found!'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'error': 'Incorrect password!'}, status=status.HTTP_401_UNAUTHORIZED)
        
        #AH-- Prepare payload for JWT token
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        #AH-- Create JWT token
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response({
            'jwt': token
        }, status=status.HTTP_200_OK)

        #AH-- Set the token in the response cookies
        response.set_cookie(key='jwt', value=token, httponly=True)

        return response


#AH-- View user details
class UserView(APIView):

    def get(self, request):

        #AH-- extract the token from cookies in request
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            
        #AH-- Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        #AH-- Retrieve the user from the database
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


#AH-- Logout user
class LogoutView(APIView):
    def post(self, request):
        #AH-- Clear the JWT token from cookies
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


#AH-- Handle password reset request, for unauthenticated user
class ResetPassword(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"message": "User with this email address does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            #AH-- Generate token and UID for password reset
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            #AH-- reset URL to be sent
            reset_url = '{}/api/reset_password_confirm/{}/{}/'.format(settings.FRONTEND_BASE_URL, uid, token)
            
            #AH-- compose and Send password reset email
            subject = 'Reset Your Password'
            message = 'Hello, \n Please click the link below to reset your password:\n{}'.format(reset_url)
            send_mail(subject, message, 'your@example.com', [user.email])
            return Response({"message": "Password reset email has been sent."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

#AH-- Confirm password reset
class ResetPasswordConfirm(APIView):
    def post(self, request, uidb64, token):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            #AH-- Decode the UID to get the user ID
            try:
                uid = force_bytes(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user is not None and default_token_generator.check_token(user, token):

                 #AH-- Set new password
                new_password = serializer.validated_data.get('new_password')

                 #AH-- Hash the new password before saving it-non user model instance
                user.password = make_password(new_password)
                user.save()
                return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid token or user not found."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

 #AH-- Edit user profile       
class EditProfileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, *args, **kwargs):
        #AH-- get jwt token from cookie
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            #AH-- Decode the JWT token to get the user ID
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        
        if not user:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
       
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                #AH-- Check if the error is due to duplicate email
                if 'unique' in str(e).lower() and 'email' in str(e).lower():
                    return Response({"email": ["Email address already exists."]}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#AH-- Delete user account
class DeleteAccountView(APIView):

    def delete(self, request):
        #AH-- get cookie,decode,get id, extract user from DB
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')
        
        #AH-- pw get from request data and verify
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required!"}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(password, user.password):
            return Response({"error": "Invalid password!"}, status=status.HTTP_400_BAD_REQUEST)

        #delete user acc
        user.delete()
        return Response({"message": "User deletion successful!"}, status=status.HTTP_204_NO_CONTENT)
    
#AH-- Reset password for authenticated user
class ResetPasswordConfirm2(APIView):

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        #AH-- get cookie,decode,get id, extract user from DB
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        #AH-- verify pws
        if not user.check_password(current_password):
            return Response({"message": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"message": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)

        #AH-- Hash
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
    




# AH-- Handle Google user registration
class SaveGoogleUserView(APIView):
    def post(self, request):
        # AH-- Initialize the serializer with request data
        serializer = GoogleUserSerializer(data=request.data)

        # AH-- Validate the serializer
        if serializer.is_valid():
            # AH-- Save validated data to create or update user
            user = serializer.save()

            # AH-- Prepare payload for JWT token
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            # AH-- Create JWT token
            token = jwt.encode(payload, 'secret', algorithm='HS256')

            response = Response({
                'user': serializer.data,
                'jwt': token
            }, status=status.HTTP_201_CREATED)

            # AH-- Set the token in the response cookies
            response.set_cookie(key='jwt', value=token, httponly=True)

            return response
        else:
            # AH-- Return errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# AH-- Handle Google user login
class GoogleLoginView(APIView):
    def post(self, request):
        # AH-- Get the email and google_id
        email = request.data.get('email')
        google_id = request.data.get('google_id')

        if not email:
            return Response({'error': 'Email is required!'}, status=status.HTTP_400_BAD_REQUEST)
        if not google_id:
            return Response({'error': 'Google ID is required!'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # AH-- Validate email
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email format!'}, status=status.HTTP_400_BAD_REQUEST)

        # AH-- Check if the user already exists in your database
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user with this email exists!'}, status=status.HTTP_404_NOT_FOUND)

        # AH-- Prepare JWT token
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        # AH-- Create JWT token
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response({
            'jwt': token
        }, status=status.HTTP_200_OK)

        # AH-- Set the token in the response cookies
        response.set_cookie(key='jwt', value=token, httponly=True)

        return response


    


#AH-- to delete an account opened with goofle
class DeleteGoogleUserAccountView(APIView):

    def delete(self, request):
        #AH-- Verify JWT token
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')


        #AH-- Retrieve user from database based on JWT
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        #AH-- Check if email exists in request data
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required!"}, status=status.HTTP_400_BAD_REQUEST)

        # AH-- Check if the provided email exists in the database
        existing_user = User.objects.filter(email=email).first()
        if not existing_user:
            return Response({"error": "User with this email does not exist!"}, status=status.HTTP_404_NOT_FOUND)

        # AH-- Delete the user account
        existing_user.delete()
        return Response({"message": "User deletion successful!"}, status=status.HTTP_204_NO_CONTENT)
    
#AH--search other users

class SearchUserView(APIView):

    def post(self, request):
        # Extract the token from cookies in request
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decode JWT token
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Get the search query from request body
        data = json.loads(request.body)
        query = data.get('query', '')

        if query:
            # Perform the search
            users = User.objects.filter(
                Q(name__icontains=query) |
                Q(email__icontains=query) |
                Q(firstName__icontains=query) |
                Q(lastName__icontains=query)
            )
        else:
            users = User.objects.none()

        # Serialize the result
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserView2(APIView):
    
    def get(self, request, user_id):
        try:
            # Retrieve the user from the database based on user_id
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("User does not exist")
        
        # Serialize the retrieved user data
        serializer = UserSerializer(user)
        
        # Return the serialized user data as JSON response
        return Response(serializer.data)