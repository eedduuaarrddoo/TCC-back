from rest_framework import serializers
from .models import Sample
from metodologia.models import Metodologia 
from django.contrib.auth import get_user_model
from metodologia.serializers import MetodologiaSerializer
from users.serializers import UserSerializer

User = get_user_model()

class SampleSerializer(serializers.ModelSerializer):
    metodologia = MetodologiaSerializer(read_only=True)  # retorna o objeto completo
    metodologia_id = serializers.PrimaryKeyRelatedField(
        queryset=Metodologia.objects.all(),
        write_only=True,
        source='metodologia'  # atribui ao campo original do modelo
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Sample
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at", "updated_at"]
