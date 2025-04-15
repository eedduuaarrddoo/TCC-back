from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Sample(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relaciona a amostra ao usuário que a cadastrou
    location = models.CharField(max_length=255)  # Local da amostra
   
    ph = models.DecimalField(max_digits=5, decimal_places=2)  # pH da amostra
    depth = models.DecimalField(max_digits=5, decimal_places=2)  # Profundidade em cm

    created_at = models.DateTimeField(auto_now_add=True)  # Data de criação
    updated_at = models.DateTimeField(auto_now=True)  # Data da última atualização

    def __str__(self):
        return f"Amostra de {self.user.first_name} em {self.location}"
