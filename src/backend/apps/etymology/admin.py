from django.contrib import admin
from .models import WordSearch, EtymologyResult

@admin.register(WordSearch)
class WordSearchAdmin(admin.ModelAdmin):
    list_display = ['word', 'user_ip', 'created_at']
    list_filter = ['created_at']
    search_fields = ['word', 'user_ip']
    ordering = ['-created_at']

@admin.register(EtymologyResult)
class EtymologyResultAdmin(admin.ModelAdmin):
    list_display = ['word', 'search', 'created_at']
    list_filter = ['created_at']
    search_fields = ['word']