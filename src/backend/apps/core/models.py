from django.db import models
from django.contrib.auth.models import AbstractUser


class BaseModel(models.Model):
    """Base model with common fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    """Abstract model with timestamp fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class WordOrigin(TimestampedModel):
    """Model to store word origins and basic information."""
    word = models.CharField(max_length=200, unique=True)
    language = models.CharField(max_length=100)
    definition = models.TextField()
    
    def __str__(self):
        return self.word
    
    class Meta:
        ordering = ['word']