from django.db import models
from apps.core.models import BaseModel
from apps.authentication.models import User


class UserActivity(BaseModel):
    """Track user activities for analytics."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)
    activity_data = models.JSONField(default=dict)
    session_id = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-created_at']


class WordAnalytics(BaseModel):
    """Analytics for word searches and analyses."""
    word = models.CharField(max_length=100)
    search_count = models.IntegerField(default=1)
    analysis_count = models.IntegerField(default=0)
    last_searched = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['word']