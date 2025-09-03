import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
from .models import WordSearch, EtymologyResult
from django.contrib.auth.models import User

@csrf_exempt
def analyze_word(request):
    """Análise etimológica usando Google Gemini AI"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            word = data.get('word', '').strip()
            
            if not word:
                return JsonResponse({'error': 'Palavra não fornecida'}, status=400)
            
            # Salvar busca no banco
            user_ip = request.META.get('REMOTE_ADDR')
            search = WordSearch.objects.create(
                word=word,
                user_ip=user_ip
            )
            
            # Configurar Gemini AI
            api_key = os.environ.get('GOOGLE_AI_API_KEY')
            if not api_key:
                return JsonResponse({'error': 'API do Google não configurada'}, status=500)
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Prompt para análise etimológica
            prompt = f"""
            Faça uma análise etimológica completa da palavra "{word}" em português.
            
            Retorne APENAS um JSON válido com esta estrutura:
            {{
                "word": "{word}",
                "original_language": "idioma de origem",
                "original_form": "forma original",
                "etymology_explanation": "explicação detalhada da etimologia",
                "prefix": "prefixo se houver",
                "root": "raiz da palavra",
                "suffix": "sufixo se houver",
                "modern_usage": "uso moderno da palavra",
                "related_words": ["palavra1", "palavra2", "palavra3"],
                "confidence_score": 0.9
            }}
            """
            
            # Chamar Gemini AI
            response = model.generate_content(prompt)
            
            # Processar resposta
            try:
                # Extrair JSON da resposta
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                analysis = json.loads(response_text)
                analysis['status'] = 'completed'
                
                # Salvar resultado no banco
                EtymologyResult.objects.create(
                    word=word,
                    result_data=analysis,
                    search=search
                )
                
                return JsonResponse({
                    'success': True,
                    'analysis': analysis,
                    'message': 'Análise concluída com Gemini AI'
                })
                
            except json.JSONDecodeError:
                # Fallback se não conseguir parsear JSON
                return JsonResponse({
                    'success': True,
                    'analysis': {
                        'word': word,
                        'etymology_explanation': response.text,
                        'status': 'completed'
                    },
                    'message': 'Análise concluída (formato texto)'
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