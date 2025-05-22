from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from metodologia.models import Metodologia
from metodologia.serializers import MetodologiaSerializer

# CREATE
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_metodologia(request):
    serializer = MetodologiaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LIST ALL
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_metodologias(request):
    metodologias = Metodologia.objects.all()
    serializer = MetodologiaSerializer(metodologias, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# GET DETAILS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_metodologia_details(request, metodologia_id):
    try:
        metodologia = Metodologia.objects.get(id=metodologia_id)
    except Metodologia.DoesNotExist:
        return Response({"error": "Metodologia não encontrada."}, status=status.HTTP_404_NOT_FOUND)
    serializer = MetodologiaSerializer(metodologia)
    return Response(serializer.data, status=status.HTTP_200_OK)


# UPDATE
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_metodologia(request, metodologia_id):
    try:
        metodologia = Metodologia.objects.get(id=metodologia_id)
    except Metodologia.DoesNotExist:
        return Response({"error": "Metodologia não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MetodologiaSerializer(metodologia, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# DELETE (single or multiple)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_metodologias(request):
    ids = request.data.get("ids", [])
    if not isinstance(ids, list) or not ids:
        return Response({"error": "Informe uma lista de IDs para deletar."}, status=status.HTTP_400_BAD_REQUEST)

    metodologias_to_delete = Metodologia.objects.filter(id__in=ids)
    if not metodologias_to_delete.exists():
        return Response({"error": "Nenhuma metodologia encontrada com os IDs fornecidos."}, status=status.HTTP_404_NOT_FOUND)

    count = metodologias_to_delete.count()
    metodologias_to_delete.delete()
    return Response({"message": f"{count} metodologia(s) deletada(s) com sucesso."}, status=status.HTTP_200_OK)


# SEARCH (exemplo buscando no campo material)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_metodologias_by_material(request):
    query = request.GET.get("material", "").strip()
    if not query:
        return Response({"error": "O parâmetro 'material' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

    metodologias = Metodologia.objects.filter(material__icontains=query)
    serializer = MetodologiaSerializer(metodologias, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
