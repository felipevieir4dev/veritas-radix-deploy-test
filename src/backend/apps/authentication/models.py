from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import BaseModel


class User(AbstractUser):
    """Custom user model for Veritas Radix."""
    email = models.EmailField(unique=True)
    user_type = models.CharField(
        max_length=10,
        choices=[('student', 'Student'), ('teacher', 'Teacher')],
        default='student'
    )
    
    # Gamification fields
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    streak_days = models.IntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)
    
    # Profile fields
    birth_date = models.DateField(null=True, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email


class Achievement(BaseModel):
    """User achievements/medals."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'title']