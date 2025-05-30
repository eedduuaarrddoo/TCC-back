from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import DiscoSample
from .serializers import DiscoSampleSerializer

# CRIAR DISCO SAMPLE
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_disc_sample(request):
    serializer = DiscoSampleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# LISTAR TODOS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_all_disc_samples(request):
    disc_samples = DiscoSample.objects.all().order_by("id")
    serializer = DiscoSampleSerializer(disc_samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# OBTER DETALHE DE UM
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_disc_sample_details(request, sample_id):
    try:
        sample = DiscoSample.objects.get(id=sample_id)
    except DiscoSample.DoesNotExist:
        return Response({"error": "DiscoSample não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DiscoSampleSerializer(sample)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ATUALIZAR
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_disc_sample(request, sample_id):
    try:
        sample = DiscoSample.objects.get(id=sample_id)
    except DiscoSample.DoesNotExist:
        return Response({"error": "DiscoSample não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DiscoSampleSerializer(sample, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DELETAR
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_disc_samples(request):
    ids = request.data.get("ids", [])
    if not isinstance(ids, list) or not ids:
        return Response({"error": "Informe uma lista de IDs para deletar."}, status=status.HTTP_400_BAD_REQUEST)

    to_delete = DiscoSample.objects.filter(id__in=ids)
    if not to_delete.exists():
        return Response({"error": "Nenhum DiscoSample encontrado com os IDs fornecidos."}, status=status.HTTP_404_NOT_FOUND)

    count = to_delete.count()
    to_delete.delete()
    return Response({"message": f"{count} DiscoSample(s) deletado(s) com sucesso."}, status=status.HTTP_200_OK)
