from django.db import models

class Metodologia(models.Model):
    nome = models.CharField(max_length=255)
    material = models.TextField()
    metodos = models.TextField()
    referencias = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome
