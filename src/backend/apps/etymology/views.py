import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def analyze_word(request):
    """Análise etimológica usando Google Gemini AI"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            word = data.get('word', '').strip()
            
            if not word:
                return JsonResponse({'error': 'Palavra não fornecida'}, status=400)
            
            # Simulação básica para testar
            analysis = {
                'word': word,
                'original_language': 'Latim',
                'etymology_explanation': f'A palavra "{word}" tem origem latina.',
                'status': 'completed'
            }
            
            return JsonResponse({
                'success': True,
                'analysis': analysis,
                'message': 'Análise concluída (teste)'
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Erro na análise: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def word_search(request):
    """Busca de palavras"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse({'results': [], 'message': 'Digite uma palavra para buscar'})
    
    # Simulação de resultados
    mock_results = [
        {
            'word': query,
            'definition': f'Definição da palavra "{query}"',
            'language': 'Português',
            'difficulty': 'intermediate'
        }
    ]
    
    return JsonResponse({
        'results': mock_results,
        'total': len(mock_results),
        'query': query
    })