from django.db import models
from metodologia.models import Metodologia  

class DiscoSample(models.Model):
    parcelas = models.CharField(max_length=255)
    quantidade = models.IntegerField()
    porcentagem = models.CharField(max_length=100)
    observacao = models.TextField(blank=True, null=True)
    metodologia = models.ForeignKey(Metodologia, on_delete=models.CASCADE, related_name="disc_samples",blank=True, null=True)
    local = models.CharField(max_length=255, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True,)

    def __str__(self):
        return f"{self.parcelas} - {self.metodologia.nome}"
