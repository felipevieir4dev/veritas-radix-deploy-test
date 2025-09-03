"""
Core views for Veritas Radix application.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import connection
from django.core.cache import cache
from django.conf import settings
import redis
import logging

logger = logging.getLogger(__name__)

class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Perform comprehensive health checks.
        """
        health_status = {
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'version': '1.0.0',
            'environment': 'production' if not settings.DEBUG else 'development',
            'checks': {}
        }
        
        # Database check
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                health_status['checks']['database'] = 'healthy'
        except Exception as e:
            health_status['checks']['database'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
        
        # Redis cache check
        try:
            cache.set('health_check', 'ok', timeout=30)
            cache_value = cache.get('health_check')
            if cache_value == 'ok':
                health_status['checks']['cache'] = 'healthy'
            else:
                health_status['checks']['cache'] = 'unhealthy'
                health_status['status'] = 'unhealthy'
        except Exception as e:
            health_status['checks']['cache'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
        
        # External APIs check
        api_checks = {}
        
        # Gemini API
        if settings.GEMINI_API_KEY:
            api_checks['gemini'] = 'configured'
        else:
            api_checks['gemini'] = 'not_configured'
        
        # OpenAI API
        if settings.OPENAI_API_KEY:
            api_checks['openai'] = 'configured'
        else:
            api_checks['openai'] = 'not_configured'
        
        # Unsplash API
        if settings.UNSPLASH_ACCESS_KEY:
            api_checks['unsplash'] = 'configured'
        else:
            api_checks['unsplash'] = 'not_configured'
        
        health_status['checks']['external_apis'] = api_checks
        
        # Return appropriate status code
        status_code = status.HTTP_200_OK if health_status['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return Response(health_status, status=status_code)

class SystemStatsView(APIView):
    """
    System statistics endpoint.
    """
    def get(self, request):
        """
        Get system-wide statistics.
        """
        from apps.etymology.models import EtymologyAnalysis
        from apps.challenges.models import Challenge, UserChallenge
        from apps.authentication.models import User
        from apps.core.models import WordOrigin, APIUsage
        
        stats = {
            'users': {
                'total': User.objects.count(),
                'active_last_30_days': User.objects.filter(
                    last_login__gte=timezone.now() - timedelta(days=30)
                ).count(),
            },
            'etymology': {
                'total_words': WordOrigin.objects.count(),
                'total_analyses': EtymologyAnalysis.objects.count(),
                'featured_words': WordOrigin.objects.filter(is_featured=True).count(),
            },
            'challenges': {
                'total_challenges': Challenge.objects.count(),
                'completed_challenges': UserChallenge.objects.filter(
                    is_completed=True
                ).count(),
            },
            'api_usage': {
                'total_requests': APIUsage.objects.count(),
                'requests_today': APIUsage.objects.filter(
                    created_at__date=timezone.now().date()
                ).count(),
            }
        }
        
        return Response(stats)

from django.utils import timezone
from datetime import timedelta