"""
Etymology URLs for Veritas Radix application.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EtymologyAnalysisViewSet,
    ImageGenerationViewSet,
    BookmarkViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'analyses', EtymologyAnalysisViewSet, basename='etymology-analysis')
router.register(r'images', ImageGenerationViewSet, basename='image-generation')
router.register(r'bookmarks', BookmarkViewSet, basename='bookmarks')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Additional custom endpoints can be added here
]