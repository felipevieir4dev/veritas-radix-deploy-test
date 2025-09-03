from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings
import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_etymology(request):
    """Analyze word etymology using Gemini API."""
    word = request.data.get('word')
    
    if not word:
        return Response(
            {'error': 'Word parameter required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Analise a etimologia da palavra "{word}" em português, fornecendo:
        1. Origem e evolução histórica
        2. Raízes linguísticas (latim, grego, etc.)
        3. Morfologia (prefixos, radicais, sufixos)
        4. Palavras relacionadas
        5. Significado atual e evolução semântica
        
        Formate a resposta como JSON com as chaves: origem, raizes, morfologia, relacionadas, significado.
        """
        
        response = model.generate_content(prompt)
        
        # Try to parse as JSON, fallback to structured text
        try:
            analysis = json.loads(response.text)
        except:
            analysis = {
                'origem': 'Análise disponível',
                'raizes': response.text[:200] + '...',
                'morfologia': 'Análise morfológica em desenvolvimento',
                'relacionadas': ['palavras', 'relacionadas'],
                'significado': 'Significado atual da palavra'
            }
        
        return Response({
            'word': word,
            'analysis': analysis
        })
        
    except Exception as e:
        return Response(
            {'error': f'Error analyzing word: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def featured_words(request):
    """Get featured words for the day."""
    words = [
        {
            'word': 'filosofia',
            'origin': 'Do grego φιλοσοφία (philosophia)',
            'meaning': 'Amor à sabedoria'
        },
        {
            'word': 'democracia',
            'origin': 'Do grego δημοκρατία (demokratia)',
            'meaning': 'Governo do povo'
        },
        {
            'word': 'biblioteca',
            'origin': 'Do grego βιβλιοθήκη (bibliotheke)',
            'meaning': 'Depósito de livros'
        }
    ]
    
    return Response({'featured_words': words})