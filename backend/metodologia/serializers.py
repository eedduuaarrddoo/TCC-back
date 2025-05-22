from rest_framework import serializers
from .models import Metodologia

class MetodologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metodologia
        fields = '__all__'
