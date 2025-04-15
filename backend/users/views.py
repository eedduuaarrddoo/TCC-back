from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password

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
        is_admin=data["is_admin"]
        
    )

    # Serializa e retorna os dados do usuário
    serializer = UserSerializer(user)
    return Response({
        "user": serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_view(request):
    """
    View para login de usuário via email e senha.
    """
    data = request.data

    # Tenta encontrar o usuário pelo email
    try:
        user = User.objects.get(email=data["email"])
    except User.DoesNotExist:
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    # Verifica se a senha está correta
    if check_password(data["password"], user.password):
        return Response({
            "message": "Login bem-sucedido",
            "username": user.username,
            "user_id" : user.id ,
            "isadm" : user.is_admin, 
        }, status=status.HTTP_200_OK)

    return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def logout_view(request):
   
    logout(request)
    return Response({"message": "Logout realizado com sucesso"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def list_all_users(request):
   
    user = User.objects.all()  
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
