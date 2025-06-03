import io
import json
import os
import zipfile
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Sample
from .serializers import SampleSerializer
from discsamples.models import DiscoSample
from discsamples.serializers import DiscoSampleSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_sample(request):
    serializer = SampleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # atribui o usuário autenticado
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
def delete_samples(request, id):
    """
    Deleta uma amostra pelo id, **sem verificar dono da amostra**.
    """
    try:
        sample = Sample.objects.get(id=id)
    except Sample.DoesNotExist:
        return Response({"error": "Amostra não encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
    sample.delete()
    return Response({"message": "Amostra deletada com sucesso."}, status=status.HTTP_200_OK)

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
    metodologia_id = request.GET.get("metodologia_id", "").strip()

    # Se nenhum filtro foi passado, retorna erro
    if not location_query and not metodologia_id:
        return Response(
            {"error": "Informe ao menos 'location' ou 'metodologia_id' para busca."},
            status=status.HTTP_400_BAD_REQUEST
        )

    filters = {"user": request.user}

    if location_query:
        filters["location__icontains"] = location_query

    if metodologia_id:
        filters["metodologia_id"] = metodologia_id

    samples = Sample.objects.filter(**filters)
    serializer = SampleSerializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def samples_by_metodologia(request, metodologia_id):
    samples = Sample.objects.filter(metodologia_id=metodologia_id, user=request.user)
    serializer = SampleSerializer(samples, many=True)

    discs = DiscoSample.objects.filter(metodologia_id=metodologia_id)
    disc_serializer = DiscoSampleSerializer(discs, many=True)

    return Response(
        {
            "samples": serializer.data,
            "discsamples": disc_serializer.data
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sample_attachments(request, sample_id):
   
    sample = get_object_or_404(Sample, id=sample_id)

    
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, mode='w', compression=zipfile.ZIP_DEFLATED) as zip_file:
        
        if sample.anexo1 and sample.anexo1.name:
            
            filename1 = os.path.basename(sample.anexo1.name)
            zip_file.write(sample.anexo1.path, arcname=filename1)

        if sample.anexo2 and sample.anexo2.name:
            filename2 = os.path.basename(sample.anexo2.name)
            zip_file.write(sample.anexo2.path, arcname=filename2)

    
    buffer.seek(0)

    
    response = HttpResponse(buffer, content_type='application/zip')
    response['Content-Disposition'] = f'attachment; filename="amostra_{sample.id}_anexos.zip"'
    return response


