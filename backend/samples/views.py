from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Sample
from .serializers import SampleSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_sample(request):
    
    serializer = SampleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_samples(request):
    
    samples = Sample.objects.filter(user=request.user)
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_all_samples(request):
   
    sort_field = request.GET.get("sort", "id")
    sort_order = request.GET.get("order", "asc")
    allowed_fields = ['id', 'ph', 'nome', 'data_coleta']
    if sort_field not in allowed_fields:
        sort_field = 'id'
    if sort_order == 'desc':
        sort_field = f'-{sort_field}'
    samples = Sample.objects.all().order_by(sort_field)
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_samples(request):
   
    ids = request.data.get("ids", [])
    if not isinstance(ids, list) or not ids:
        return Response({"error": "Informe uma lista de IDs para deletar."}, status=status.HTTP_400_BAD_REQUEST)
    samples_to_delete = Sample.objects.filter(id__in=ids, user=request.user)
    if not samples_to_delete.exists():
        return Response({"error": "Nenhuma amostra encontrada com os IDs fornecidos."}, status=status.HTTP_404_NOT_FOUND)
    count = samples_to_delete.count()
    samples_to_delete.delete()
    return Response({"message": f"{count} amostra(s) deletada(s) com sucesso."}, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_sample(request, sample_id):
   
    try:
        sample = Sample.objects.get(id=sample_id, user=request.user)
    except Sample.DoesNotExist:
        return Response({"error": "Amostra não encontrada."}, status=status.HTTP_404_NOT_FOUND)
    serializer = SampleSerializer(sample, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sample_details(request, sample_id):
   
    try:
        sample = Sample.objects.get(id=sample_id)
    except Sample.DoesNotExist:
        return Response({"error": "Amostra não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    serializer = SampleSerializer(sample)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_samples_ids(request, user_id):
    
    samples_ids = Sample.objects.filter(user__id=user_id).values_list('id', flat=True)
    return Response({'samples_ids': list(samples_ids)}, status=status.HTTP_200_OK)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_samples_by_location(request):
    location_query = request.GET.get("location", "").strip()

    if not location_query:
        return Response(
            {"error": "O parâmetro 'location' é obrigatório."},
            status=status.HTTP_400_BAD_REQUEST
        )

    samples = Sample.objects.filter(location__icontains=location_query, user=request.user)
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
