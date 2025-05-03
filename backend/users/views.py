from django.contrib.auth import get_user_model,  logout
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from .permissions import IsCustomAdmin
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

@api_view(["POST"])
def register(request):
    data = request.data

    
    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)

    
    user = User.objects.create_user(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        is_admin=data.get("is_admin", False)  # Usa get para valor padrão
    )

    
    refresh = RefreshToken.for_user(user)
    
    
    serializer = UserSerializer(user)
    
    return Response({
        "user": serializer.data,
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([AllowAny])   # permite acesso sem JWT
def login_view(request):
    data = request.data
    try:
        user = User.objects.get(email=data.get("email"))
    except User.DoesNotExist:
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(data.get("password"), user.password):
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login bem-sucedido",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": user.is_admin,
            "user_id": user.id,
            "username": user.username,
        }, status=status.HTTP_200_OK)

    return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def logout_view(request):
   
    logout(request)
    return Response({"message": "Logout realizado com sucesso"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsCustomAdmin])
def list_all_users(request):
    """
    Apenas admins podem listar todos os usuários.
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsCustomAdmin])
def delete_user(request, user_id):
    """
    Só admin pode deletar usuários.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response({"message": "Usuário deletado com sucesso"}, status=status.HTTP_200_OK)



@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsCustomAdmin])
def edit_user(request, user_id):
    """
    Só admin pode editar qualquer usuário.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.is_admin = data.get("is_admin", user.is_admin)

    if data.get("password"):
        user.set_password(data["password"])

    user.save()
    serializer = UserSerializer(user)
    return Response({
        "message": "Usuário atualizado com sucesso",
        "user": serializer.data
    }, status=status.HTTP_200_OK)