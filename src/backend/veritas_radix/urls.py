"""
URL configuration for Veritas Radix project.
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'API funcionando'})

@csrf_exempt
def analyze_etymology(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            word = data.get('word', '').strip()
            
            if not word:
                return JsonResponse({'error': 'Palavra não fornecida'}, status=400)
            
            # Verificar se tem API key do Gemini
            api_key = os.environ.get('GOOGLE_AI_API_KEY')
            if not api_key:
                # Fallback sem IA
                analysis = {
                    'word': word,
                    'original_language': 'Latim',
                    'etymology_explanation': f'A palavra "{word}" tem origem latina (análise básica).',
                    'prefix': '',
                    'root': word[:3] if len(word) > 3 else word,
                    'suffix': word[3:] if len(word) > 3 else '',
                    'related_words': [f'{word}ar', f'{word}ção']
                }
                return JsonResponse({
                    'success': True,
                    'analysis': analysis,
                    'message': 'Análise básica (API Gemini não configurada)'
                })
            
            # Usar Gemini AI
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-pro')
                
                prompt = f"""
                Faça uma análise etimológica completa da palavra "{word}" em português.
                
                Retorne APENAS um JSON válido com esta estrutura:
                {{
                    "word": "{word}",
                    "original_language": "idioma de origem",
                    "etymology_explanation": "explicação detalhada da etimologia",
                    "prefix": "prefixo se houver",
                    "root": "raiz da palavra",
                    "suffix": "sufixo se houver",
                    "related_words": ["palavra1", "palavra2", "palavra3"]
                }}
                """
                
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                # Limpar markdown se houver
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                analysis = json.loads(response_text)
                
                return JsonResponse({
                    'success': True,
                    'analysis': analysis,
                    'message': 'Análise concluída com Gemini AI'
                })
                
            except json.JSONDecodeError:
                # Se não conseguir parsear, usar resposta como texto
                return JsonResponse({
                    'success': True,
                    'analysis': {
                        'word': word,
                        'etymology_explanation': response.text,
                        'original_language': 'Análise textual',
                        'prefix': '',
                        'root': word,
                        'suffix': '',
                        'related_words': []
                    },
                    'message': 'Análise concluída (formato texto)'
                })
            except Exception as e:
                return JsonResponse({'error': f'Erro na IA: {str(e)}'}, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etymology/analyze/', analyze_etymology),
    path('', health_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)