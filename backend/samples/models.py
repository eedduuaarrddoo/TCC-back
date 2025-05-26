from django.db import models
from django.contrib.auth import get_user_model
from metodologia.models import Metodologia

User = get_user_model()

class Sample(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relaciona a amostra ao usuário que a cadastrou
    location = models.CharField(max_length=255)  # Local da amostra
   
    ph = models.DecimalField(max_digits=5, decimal_places=2)  # pH da amostra
    depth = models.DecimalField(max_digits=5, decimal_places=2)  # Profundidade em cm
    metodologia = models.ForeignKey(Metodologia, on_delete=models.CASCADE,null=True,blank=True, related_name='amostras')  # Relação com metodologia
    created_at = models.DateTimeField(auto_now_add=True)  # Data de criação
    updated_at = models.DateTimeField(auto_now=True)  # Data da última atualização
    spacamento = models.CharField(max_length=255, null=True, blank=True)
    arvore = models.CharField(max_length=255, null=True, blank=True)
    porcentagem = models.CharField(max_length=255, null=True, blank=True)
    observacao = models.CharField(max_length=255, null=True, blank=True)
    espacamento2 = models.CharField(max_length=255, null=True, blank=True)
    altura = models.CharField(max_length=255, null=True, blank=True)
    profundidade_info = models.CharField(max_length=255, null=True, blank=True)  # nome diferente para não confundir com o campo `depth`
    vertice = models.CharField(max_length=255, null=True, blank=True)
    talhao = models.CharField(max_length=255, null=True, blank=True)
    parcela = models.CharField(max_length=255, null=True, blank=True)
    tratamento = models.CharField(max_length=255, null=True, blank=True)
    identificacao = models.CharField(max_length=255, null=True, blank=True)
    ac = models.CharField(max_length=255, null=True, blank=True)
    anexo1 = models.CharField(max_length=255, null=True, blank=True)
    anexo2 = models.CharField(max_length=255, null=True, blank=True)
    

    def __str__(self):
        return f"Amostra de {self.user.first_name} em {self.location}"
