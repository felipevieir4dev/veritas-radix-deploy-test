import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def analyze_word(request):
    """Análise etimológica básica de uma palavra"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            word = data.get('word', '').strip().lower()
            
            if not word:
                return JsonResponse({'error': 'Palavra não fornecida'}, status=400)
            
            # Simulação básica de análise etimológica
            mock_analysis = {
                'word': word,
                'original_language': 'Latim',
                'original_form': f'{word}us',
                'etymology_explanation': f'A palavra "{word}" tem origem no latim clássico.',
                'prefix': word[:2] if len(word) > 3 else '',
                'root': word[2:-1] if len(word) > 3 else word,
                'suffix': word[-1:] if len(word) > 3 else '',
                'modern_usage': f'Atualmente "{word}" é usado em contextos diversos.',
                'related_words': [f'{word}ção', f'{word}ar', f'{word}ismo'],
                'confidence_score': 0.85,
                'status': 'completed'
            }
            
            return JsonResponse({
                'success': True,
                'analysis': mock_analysis,
                'message': 'Análise concluída (versão de teste)'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
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