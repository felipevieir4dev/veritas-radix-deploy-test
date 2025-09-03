from django.db import models
from apps.core.models import BaseModel
from apps.authentication.models import User


class Challenge(BaseModel):
    """Etymology challenges for gamification."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(
        max_length=50,
        choices=[
            ('etymology', 'Etymology Analysis'),
            ('morphology', 'Morphology'),
            ('quiz', 'Quick Quiz'),
            ('creative', 'Creative Challenge')
        ]
    )
    difficulty = models.CharField(
        max_length=20,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')]
    )
    xp_reward = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title


class UserChallenge(BaseModel):
    """User's progress on challenges."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'challenge']