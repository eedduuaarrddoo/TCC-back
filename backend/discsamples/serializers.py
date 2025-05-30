from rest_framework import serializers
from .models import DiscoSample
from metodologia.models import Metodologia
from metodologia.serializers import MetodologiaSerializer

class DiscoSampleSerializer(serializers.ModelSerializer):
    
    metodologia = MetodologiaSerializer(read_only=True)
  
    metodologia_id = serializers.PrimaryKeyRelatedField(
        queryset=Metodologia.objects.all(),
        source="metodologia",
        write_only=True
    )

    class Meta:
        model = DiscoSample
       
        fields = "__all__"
        
       
        read_only_fields = ["id", "criado_em", "atualizado_em"]
