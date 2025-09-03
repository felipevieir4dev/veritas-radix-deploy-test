"""
Etymology serializers for Veritas Radix application.
"""
from rest_framework import serializers
from .models import (
    EtymologyAnalysis, 
    EtymologyBookmark, 
    EtymologyCorrection,
    PopularSearch,
    FeaturedWord
)
from apps.core.models import WordOrigin, EtymologyImage

class EtymologyAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for etymology analysis.
    """
    is_bookmarked = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = EtymologyAnalysis
        fields = [
            'id', 'word', 'status', 'original_language', 'original_form',
            'transliteration', 'prefix', 'prefix_meaning', 'root', 'root_meaning',
            'suffix', 'suffix_meaning', 'etymology_explanation', 'historical_context',
            'modern_usage', 'related_words', 'confidence_score', 'view_count',
            'created_at', 'updated_at', 'is_bookmarked', 'images'
        ]
        read_only_fields = [
            'id', 'status', 'view_count', 'created_at', 'updated_at',
            'is_bookmarked', 'images'
        ]
    
    def get_is_bookmarked(self, obj):
        """Check if analysis is bookmarked by current user."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EtymologyBookmark.objects.filter(
                user=request.user,
                analysis=obj
            ).exists()
        return False
    
    def get_images(self, obj):
        """Get related images for the word."""
        if obj.word_origin:
            images = obj.word_origin.images.filter(is_active=True)[:3]
            return EtymologyImageSerializer(images, many=True).data
        return []

class EtymologyImageSerializer(serializers.ModelSerializer):
    """
    Serializer for etymology images.
    """
    class Meta:
        model = EtymologyImage
        fields = [
            'id', 'image_url', 'thumbnail_url', 'alt_text', 'source',
            'photographer_name', 'photographer_url', 'usage_count'
        ]

class EtymologyBookmarkSerializer(serializers.ModelSerializer):
    """
    Serializer for etymology bookmarks.
    """
    analysis = EtymologyAnalysisSerializer(read_only=True)
    
    class Meta:
        model = EtymologyBookmark
        fields = ['id', 'analysis', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class EtymologyCorrectionSerializer(serializers.ModelSerializer):
    """
    Serializer for etymology corrections.
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = EtymologyCorrection
        fields = [
            'id', 'field_name', 'original_value', 'corrected_value',
            'explanation', 'is_approved', 'user_name', 'created_at'
        ]
        read_only_fields = ['id', 'is_approved', 'user_name', 'created_at']

class PopularSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for popular searches.
    """
    class Meta:
        model = PopularSearch
        fields = [
            'word', 'search_count', 'last_searched', 'difficulty_level',
            'categories'
        ]

class WordOriginSerializer(serializers.ModelSerializer):
    """
    Serializer for word origins.
    """
    related_words_count = serializers.SerializerMethodField()
    images = EtymologyImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = WordOrigin
        fields = [
            'id', 'word', 'language', 'original_form', 'transliteration',
            'meaning', 'definition', 'prefix', 'prefix_meaning', 'root',
            'root_meaning', 'suffix', 'suffix_meaning', 'historical_context',
            'first_recorded_use', 'evolution_notes', 'difficulty_level',
            'search_count', 'is_featured', 'related_words_count', 'images'
        ]
    
    def get_related_words_count(self, obj):
        """Get count of related words."""
        return obj.related_words.count()

class FeaturedWordSerializer(serializers.ModelSerializer):
    """
    Serializer for featured words.
    """
    word_origin = WordOriginSerializer(read_only=True)
    
    class Meta:
        model = FeaturedWord
        fields = [
            'id', 'word_origin', 'display_order', 'custom_title',
            'custom_description', 'custom_image_prompt', 'start_date', 'end_date'
        ]

class EtymologySearchSerializer(serializers.Serializer):
    """
    Serializer for etymology search requests.
    """
    word = serializers.CharField(max_length=200, required=True)
    include_related = serializers.BooleanField(default=True)
    include_images = serializers.BooleanField(default=True)
    
    def validate_word(self, value):
        """Validate word input."""
        value = value.strip().lower()
        if not value:
            raise serializers.ValidationError("Word cannot be empty")
        if len(value) > 200:
            raise serializers.ValidationError("Word is too long")
        return value

class ImageGenerationSerializer(serializers.Serializer):
    """
    Serializer for image generation requests.
    """
    word = serializers.CharField(max_length=200, required=True)
    etymology = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    style = serializers.ChoiceField(
        choices=[
            ('manuscript', 'Medieval Manuscript'),
            ('classical', 'Classical Art'),
            ('modern', 'Modern Illustration'),
        ],
        default='manuscript'
    )
    
    def validate_word(self, value):
        """Validate word input."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Word cannot be empty")
        return value

class EtymologyStatsSerializer(serializers.Serializer):
    """
    Serializer for etymology statistics.
    """
    total_analyses = serializers.IntegerField()
    user_analyses = serializers.IntegerField()
    popular_words = PopularSearchSerializer(many=True)
    recent_searches = serializers.ListField(child=serializers.CharField())
    success_rate = serializers.FloatField()
    average_confidence = serializers.FloatField()