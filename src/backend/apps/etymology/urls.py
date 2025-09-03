from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_word, name='analyze-word'),
    path('search/', views.word_search, name='word-search'),
]