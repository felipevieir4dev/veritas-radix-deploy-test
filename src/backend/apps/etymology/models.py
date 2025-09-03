"""
Etymology models for Veritas Radix application.
"""
from django.db import models
from apps.core.models import TimestampedModel, WordOrigin
from django.contrib.auth import get_user_model

User = get_user_model()

class EtymologyAnalysis(TimestampedModel):
    """
    Model to store etymology analysis results from Gemini AI.
    """
    ANALYSIS_STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
        ('cached', 'Em Cache'),
    ]
    
    word = models.CharField(max_length=200, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    word_origin = models.ForeignKey(
        WordOrigin, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='analyses'
    )
    
    # Analysis results
    status = models.CharField(max_length=20, choices=ANALYSIS_STATUS_CHOICES, default='pending')
    raw_response = models.JSONField(default=dict, blank=True)
    processed_data = models.JSONField(default=dict, blank=True)
    
    # Morphological breakdown
    original_language = models.CharField(max_length=100, blank=True)
    original_form = models.CharField(max_length=200, blank=True)
    transliteration = models.CharField(max_length=200, blank=True)
    
    prefix = models.CharField(max_length=100, blank=True)
    prefix_meaning = models.CharField(max_length=200, blank=True)
    root = models.CharField(max_length=100, blank=True)
    root_meaning = models.CharField(max_length=200, blank=True)
    suffix = models.CharField(max_length=100, blank=True)
    suffix_meaning = models.CharField(max_length=200, blank=True)
    
    # Complete analysis
    etymology_explanation = models.TextField(blank=True)
    historical_context = models.TextField(blank=True)
    modern_usage = models.TextField(blank=True)
    related_words = models.JSONField(default=list, blank=True)
    
    # AI metadata
    model_used = models.CharField(max_length=100, default='gemini-pro')
    tokens_used = models.PositiveIntegerField(default=0)
    processing_time_ms = models.PositiveIntegerField(default=0)
    cost_usd = models.DecimalField(max_digits=8, decimal_places=6, default=0)
    
    # Quality and validation
    confidence_score = models.FloatField(default=0.0, help_text="AI confidence in analysis (0-1)")
    is_validated = models.BooleanField(default=False)
    validation_notes = models.TextField(blank=True)
    
    # Usage tracking
    view_count = models.PositiveIntegerField(default=0)
    last_viewed = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Analysis: {self.word} ({self.status})"
    
    def mark_as_viewed(self):
        """Increment view count and update last viewed timestamp."""
        from django.utils import timezone
        self.view_count += 1
        self.last_viewed = timezone.now()
        self.save(update_fields=['view_count', 'last_viewed'])
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['word', 'user']

class EtymologyCorrection(TimestampedModel):
    """
    Model to store user corrections and feedback on etymology analyses.
    """
    analysis = models.ForeignKey(
        EtymologyAnalysis, 
        on_delete=models.CASCADE, 
        related_name='corrections'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Correction details
    field_name = models.CharField(max_length=100)  # Which field is being corrected
    original_value = models.TextField()
    corrected_value = models.TextField()
    explanation = models.TextField(blank=True)
    
    # Status
    is_approved = models.BooleanField(default=False)
    reviewed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='reviewed_corrections'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Correction for {self.analysis.word} by {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']

class EtymologyBookmark(TimestampedModel):
    """
    Model to store user bookmarks of etymology analyses.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis = models.ForeignKey(EtymologyAnalysis, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.username} -> {self.analysis.word}"
    
    class Meta:
        unique_together = ['user', 'analysis']
        ordering = ['-created_at']

class PopularSearch(TimestampedModel):
    """
    Model to track popular searches and trending words.
    """
    word = models.CharField(max_length=200, unique=True)
    search_count = models.PositiveIntegerField(default=1)
    last_searched = models.DateTimeField(auto_now=True)
    
    # Trending metrics
    daily_searches = models.PositiveIntegerField(default=0)
    weekly_searches = models.PositiveIntegerField(default=0)
    monthly_searches = models.PositiveIntegerField(default=0)
    
    # Metadata
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Iniciante'),
            ('intermediate', 'Intermediário'),
            ('advanced', 'Avançado'),
        ],
        default='beginner'
    )
    categories = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"{self.word} ({self.search_count} searches)"
    
    @classmethod
    def increment_search(cls, word):
        """Increment search count for a word."""
        search, created = cls.objects.get_or_create(
            word=word.lower(),
            defaults={'search_count': 1}
        )
        if not created:
            search.search_count += 1
            search.daily_searches += 1
            search.save()
        return search
    
    class Meta:
        ordering = ['-search_count', '-last_searched']

class FeaturedWord(TimestampedModel):
    """
    Model to manage featured words for the main screen.
    """
    word_origin = models.OneToOneField(
        WordOrigin, 
        on_delete=models.CASCADE,
        related_name='featured_info'
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Display customization
    custom_title = models.CharField(max_length=200, blank=True)
    custom_description = models.TextField(blank=True)
    custom_image_prompt = models.TextField(blank=True)
    
    # Scheduling
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Featured: {self.word_origin.word}"
    
    class Meta:
        ordering = ['display_order', '-created_at']