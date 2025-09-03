from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint."""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'user_type': user.user_type,
                'xp': user.xp,
                'level': user.level
            }
        })
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Registration endpoint."""
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username')
    user_type = request.data.get('user_type', 'student')
    
    if not all([email, password, username]):
        return Response(
            {'error': 'Email, password and username required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        email=email,
        password=password,
        username=username,
        user_type=user_type
    )
    
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type,
            'xp': user.xp,
            'level': user.level
        }
    }, status=status.HTTP_201_CREATED)