from django.db import models
from django.contrib.auth.models import User

class WordSearch(models.Model):
    """Modelo para rastrear buscas de palavras"""
    word = models.CharField(max_length=200)
    user_ip = models.GenericIPAddressField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.word} - {self.created_at}"
    
    class Meta:
        ordering = ['-created_at']

class EtymologyResult(models.Model):
    """Modelo para armazenar resultados de etimologia"""
    word = models.CharField(max_length=200)
    result_data = models.JSONField()
    search = models.ForeignKey(WordSearch, on_delete=models.CASCADE, related_name='results')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Resultado: {self.word}"