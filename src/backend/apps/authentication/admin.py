from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Achievement


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'user_type', 'xp', 'level', 'is_active']
    list_filter = ['user_type', 'is_active', 'level']
    search_fields = ['email', 'username']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Gamification', {'fields': ('xp', 'level', 'streak_days')}),
        ('Profile', {'fields': ('user_type', 'birth_date', 'institution')}),
    )


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'earned_at']
    list_filter = ['earned_at']
    search_fields = ['user__email', 'title']