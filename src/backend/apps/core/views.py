import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def test_apis(request):
    """Testa se as APIs estão configuradas"""
    results = {}
    
    # Testar Google AI API
    google_key = os.environ.get('GOOGLE_AI_API_KEY')
    results['google_ai'] = {
        'configured': bool(google_key),
        'key_preview': f"{google_key[:10]}..." if google_key else None
    }
    
    # Testar OpenAI API
    openai_key = os.environ.get('OPENAI_API_KEY')
    results['openai'] = {
        'configured': bool(openai_key),
        'key_preview': f"{openai_key[:10]}..." if openai_key else None
    }
    
    # Testar Django Secret Key
    secret_key = os.environ.get('DJANGO_SECRET_KEY')
    results['django_secret'] = {
        'configured': bool(secret_key),
        'key_preview': f"{secret_key[:10]}..." if secret_key else None
    }
    
    return JsonResponse({
        'status': 'ok',
        'environment_variables': results,
        'all_configured': all([google_key, openai_key, secret_key])
    })

def health_check(request):
    """Health check básico"""
    return JsonResponse({
        'status': 'ok', 
        'message': 'Veritas Radix API is running',
        'admin_url': '/admin/'
    })