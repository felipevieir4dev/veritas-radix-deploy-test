"""
URL configuration for Veritas Radix project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from apps.core.views import HealthCheckView

# Main router for API
router = DefaultRouter()

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # API routes
    path('api/v1/', include([
        path('auth/', include('apps.authentication.urls')),
        path('etymology/', include('apps.etymology.urls')),
        path('challenges/', include('apps.challenges.urls')),
        path('analytics/', include('apps.analytics.urls')),
        path('', include(router.urls)),
    ])),
    
    # API documentation
    path('api/docs/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin
admin.site.site_header = "Veritas Radix Admin"
admin.site.site_title = "Veritas Radix"
admin.site.index_title = "Administração do Sistema"