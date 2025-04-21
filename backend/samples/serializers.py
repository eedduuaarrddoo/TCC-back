from rest_framework import serializers
from .models import Sample

class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = [
            "id",
            "user",
            "location",
            "ph",
            "depth",
            "atributo1",  
            "atributo2",  
            "atributo3",  
            "created_at"
        ]
        read_only_fields = ["id", "user", "created_at"]
