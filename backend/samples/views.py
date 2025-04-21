from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Sample, User
from .serializers import SampleSerializer

#mudar para token
@api_view(["POST"])
def create_sample(request):
    data = request.data
    user_id = data.get("user_id") 

    if not user_id:
        return Response({"error": "Usuário não fornecido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuário inválido"}, status=status.HTTP_404_NOT_FOUND)

    data.pop("user_id", None) 

    serializer = SampleSerializer(data=data)

    if serializer.is_valid():
        serializer.save(user=user) 
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#listar as amostras do usuario 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_samples(request):
    
    samples = Sample.objects.filter(user=request.user)  
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

    
   #listar todas 
    
@api_view(["GET"])
def list_all_samples(request):
    # Obtém os parâmetros de ordenação da URL
    sort_field = request.GET.get("sort", "id")
    sort_order = request.GET.get("order", "asc")

    # Lista de campos permitidos para ordenação
    allowed_fields = ['id', 'ph', 'nome', 'data_coleta']  # Adapte com seus campos reais

    # Validação básica do campo
    if sort_field not in allowed_fields:
        sort_field = 'id'

    # Aplica o prefixo "-" para ordenação descendente
    if sort_order == 'desc':
        sort_field = f'-{sort_field}'

    # Busca ordenada no banco
    samples = Sample.objects.all().order_by(sort_field)
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["DELETE"])
def delete_samples(request):
    ids = request.data.get("ids", [])

    if not isinstance(ids, list) or not ids:
        return Response({"error": "Informe uma lista de IDs para deletar."}, status=status.HTTP_400_BAD_REQUEST)

    samples_to_delete = Sample.objects.filter(id__in=ids)

    if not samples_to_delete.exists():
        return Response({"error": "Nenhuma amostra encontrada com os IDs fornecidos."}, status=status.HTTP_404_NOT_FOUND)

    count = samples_to_delete.count()
    samples_to_delete.delete()

    return Response({"message": f"{count} amostra(s) deletada(s) com sucesso."}, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_sample(request, sample_id):
    try:
        sample = Sample.objects.get(id=sample_id)
    except Sample.DoesNotExist:
        return Response({"error": "Amostra não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    serializer = SampleSerializer(sample, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_sample_details(request, sample_id):
    try:
        sample = Sample.objects.get(id=sample_id)
    except Sample.DoesNotExist:
        return Response({"error": "Amostra não encontrada"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SampleSerializer(sample)
    return Response(serializer.data, status=status.HTTP_200_OK)
