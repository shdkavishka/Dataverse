from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    #AH--optional
    profilePicture = serializers.ImageField(required=False)

    class Meta:
        model = User

        #AH--field to include in serialisation
        fields = [
            'id', 'name', 'email', 'password', 
            'firstName', 'lastName', 'bio', 
            'profilePicture', 'gender', 'location'
        ]

        #AH--pw cannot be read
        extra_kwargs = {
            'password': {'write_only': True},
        }

#AH--to create user
    def create(self, validated_data):

        #rAH--emoving pw from validated data
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            #AH--hashing
            instance.set_password(password)
            
        instance.save()#AH--to DB
        return instance

#AH--to edit user
    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)

        for (key, value) in validated_data.items():
            setattr(instance, key, value)

        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance
    
    
#AH--get user mail id
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')
#AH--cheking if pws match
        if new_password != confirm_new_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data
    


class EditProfileRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
#AH--validate email to edit profile
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email address does not exist.")
        return value