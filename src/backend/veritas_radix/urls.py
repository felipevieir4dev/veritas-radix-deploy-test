"""
URL configuration for Veritas Radix project.
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'API funcionando'})

def test_etymology(request):
    return JsonResponse({'word': 'teste', 'etymology': 'origem teste'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etymology/analyze/', test_etymology),
    path('', health_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)