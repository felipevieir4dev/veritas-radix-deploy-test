"""
Etymology services for external API integrations.
"""
import google.generativeai as genai
import openai
import requests
import time
import json
from django.conf import settings
from django.core.cache import cache
from apps.core.models import APIUsage
import logging

logger = logging.getLogger(__name__)

class GeminiEtymologyService:
    """
    Service for etymology analysis using Google Gemini AI.
    """
    
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("Gemini API key not configured")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        
    def analyze_etymology(self, word):
        """
        Analyze the etymology of a word using Gemini AI.
        """
        start_time = time.time()
        
        try:
            prompt = self._build_etymology_prompt(word)
            
            # Generate response
            response = self.model.generate_content(prompt)
            
            processing_time_ms = int((time.time() - start_time) * 1000)
            
            # Parse and structure the response
            parsed_data = self._parse_etymology_response(response.text, word)
            
            # Log API usage
            self._log_api_usage(
                endpoint='etymology_analysis',
                request_data={'word': word, 'prompt': prompt},
                response_data={'text': response.text},
                tokens_used=getattr(response, 'usage_metadata', {}).get('total_token_count', 0),
                processing_time_ms=processing_time_ms,
                success=True
            )
            
            return {
                'success': True,
                'data': parsed_data,
                'raw_response': response.text,
                'tokens_used': getattr(response, 'usage_metadata', {}).get('total_token_count', 0),
                'processing_time_ms': processing_time_ms
            }
            
        except Exception as e:
            processing_time_ms = int((time.time() - start_time) * 1000)
            logger.error(f"Gemini etymology analysis failed for '{word}': {str(e)}")
            
            # Log failed API usage
            self._log_api_usage(
                endpoint='etymology_analysis',
                request_data={'word': word},
                response_data={},
                processing_time_ms=processing_time_ms,
                success=False,
                error_message=str(e)
            )
            
            return {
                'success': False,
                'error': str(e)
            }
    
    def _build_etymology_prompt(self, word):
        """
        Build a comprehensive prompt for etymology analysis.
        """
        return f"""
        Como especialista em etimologia e linguística histórica, forneça uma análise detalhada da palavra "{word}" em português. 

        Estruture sua resposta exatamente no seguinte formato JSON:

        {{
            "word": "{word}",
            "original_language": "nome da língua de origem (ex: Grego Antigo, Latim, etc.)",
            "original_form": "forma original da palavra na língua de origem",
            "transliteration": "transliteração se aplicável",
            "prefix": "prefixo identificado ou vazio se não houver",
            "prefix_meaning": "significado do prefixo",
            "root": "raiz principal da palavra",
            "root_meaning": "significado da raiz",
            "suffix": "sufixo identificado ou vazio se não houver",
            "suffix_meaning": "significado do sufixo",
            "etymology_explanation": "explicação completa da etimologia em 2-3 parágrafos",
            "historical_context": "contexto histórico e cultural da palavra",
            "modern_usage": "como a palavra é usada atualmente",
            "related_words": ["lista", "de", "palavras", "relacionadas"],
            "confidence_score": 0.95
        }}

        IMPORTANTE:
        - Seja preciso e academicamente rigoroso
        - Se não tiver certeza sobre algo, indique isso na confidence_score (0.0 a 1.0)
        - Para palavras compostas, identifique todos os elementos
        - Inclua informações sobre mudanças semânticas ao longo do tempo
        - Mencione cognatos em outras línguas quando relevante
        - Use terminologia técnica apropriada da linguística
        - Responda APENAS com o JSON, sem texto adicional
        """
    
    def _parse_etymology_response(self, response_text, word):
        """
        Parse and validate the Gemini response.
        """
        try:
            # Clean the response text
            response_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Parse JSON
            data = json.loads(response_text.strip())
            
            # Validate required fields
            required_fields = [
                'word', 'original_language', 'original_form', 
                'etymology_explanation', 'confidence_score'
            ]
            
            for field in required_fields:
                if field not in data:
                    data[field] = ''
            
            # Ensure confidence_score is a float
            try:
                data['confidence_score'] = float(data.get('confidence_score', 0.5))
            except (ValueError, TypeError):
                data['confidence_score'] = 0.5
            
            # Ensure related_words is a list
            if not isinstance(data.get('related_words'), list):
                data['related_words'] = []
            
            return data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response for '{word}': {str(e)}")
            logger.error(f"Response text: {response_text}")
            
            # Return fallback structure
            return {
                'word': word,
                'original_language': 'Análise incompleta',
                'original_form': word,
                'transliteration': '',
                'prefix': '',
                'prefix_meaning': '',
                'root': word,
                'root_meaning': 'Significado a ser determinado',
                'suffix': '',
                'suffix_meaning': '',
                'etymology_explanation': f'Análise etimológica de "{word}" em processamento. Por favor, tente novamente.',
                'historical_context': 'Contexto histórico a ser determinado.',
                'modern_usage': 'Uso moderno a ser analisado.',
                'related_words': [],
                'confidence_score': 0.1
            }
    
    def _log_api_usage(self, endpoint, request_data, response_data, tokens_used=0, 
                      processing_time_ms=0, success=True, error_message=''):
        """
        Log API usage for monitoring and billing.
        """
        try:
            APIUsage.objects.create(
                service='gemini',
                endpoint=endpoint,
                request_data=request_data,
                response_data=response_data,
                tokens_used=tokens_used,
                cost_usd=self._calculate_cost(tokens_used),
                response_time_ms=processing_time_ms,
                success=success,
                error_message=error_message
            )
        except Exception as e:
            logger.error(f"Failed to log API usage: {str(e)}")
    
    def _calculate_cost(self, tokens_used):
        """
        Calculate estimated cost based on tokens used.
        Gemini Pro pricing: approximately $0.000125 per 1K tokens
        """
        if tokens_used == 0:
            return 0.0
        
        cost_per_1k_tokens = 0.000125
        return (tokens_used / 1000) * cost_per_1k_tokens

class ImageGenerationService:
    """
    Service for generating etymology-related images using DALL-E and fallbacks.
    """
    
    def __init__(self):
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
    
    def generate_etymology_image(self, word, etymology_context=''):
        """
        Generate an image related to a word's etymology.
        """
        start_time = time.time()
        
        try:
            # Try DALL-E first if available
            if self.openai_client:
                result = self._generate_with_dalle(word, etymology_context)
                if result['success']:
                    return result
            
            # Fallback to Unsplash
            return self._get_unsplash_image(word)
            
        except Exception as e:
            logger.error(f"Image generation failed for '{word}': {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_with_dalle(self, word, etymology_context):
        """
        Generate image using DALL-E.
        """
        try:
            prompt = self._build_image_prompt(word, etymology_context)
            
            response = self.openai_client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            image_url = response.data[0].url
            
            # Log API usage
            self._log_api_usage(
                endpoint='image_generation',
                request_data={'word': word, 'prompt': prompt},
                response_data={'url': image_url},
                success=True
            )
            
            return {
                'success': True,
                'image_url': image_url,
                'source': 'dalle',
                'metadata': {
                    'prompt': prompt,
                    'model': 'dall-e-3'
                }
            }
            
        except Exception as e:
            logger.error(f"DALL-E generation failed for '{word}': {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _get_unsplash_image(self, word):
        """
        Get image from Unsplash as fallback.
        """
        try:
            # Define search queries for common etymology words
            search_queries = {
                'filosofia': 'ancient greek philosophy marble statue',
                'democracia': 'ancient greek agora columns democracy',
                'biblioteca': 'ancient library alexandria scrolls books',
                'psicologia': 'human brain psychology mind consciousness',
                'tecnologia': 'ancient tools craftsmanship engineering',
                'nostalgia': 'vintage sepia memories old photographs'
            }
            
            query = search_queries.get(word.lower(), f'ancient manuscript {word.lower()}')
            
            if settings.UNSPLASH_ACCESS_KEY:
                url = f"https://api.unsplash.com/search/photos"
                params = {
                    'query': query,
                    'per_page': 1,
                    'orientation': 'landscape'
                }
                headers = {
                    'Authorization': f'Client-ID {settings.UNSPLASH_ACCESS_KEY}'
                }
                
                response = requests.get(url, params=params, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if data['results']:
                        photo = data['results'][0]
                        return {
                            'success': True,
                            'image_url': photo['urls']['regular'],
                            'thumbnail_url': photo['urls']['small'],
                            'source': 'unsplash',
                            'attribution': {
                                'photographer': photo['user']['name'],
                                'username': photo['user']['username'],
                                'profile_url': photo['user']['links']['html']
                            }
                        }
            
            # Final fallback to static images
            return self._get_fallback_image(word)
            
        except Exception as e:
            logger.error(f"Unsplash image fetch failed for '{word}': {str(e)}")
            return self._get_fallback_image(word)
    
    def _get_fallback_image(self, word):
        """
        Get fallback static image.
        """
        fallback_images = {
            'filosofia': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format&q=80',
            'democracia': 'https://images.unsplash.com/photo-1541872703-74c34d2846b5?w=400&h=300&fit=crop&auto=format&q=80',
            'biblioteca': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=80',
            'default': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format&q=80'
        }
        
        image_url = fallback_images.get(word.lower(), fallback_images['default'])
        
        return {
            'success': True,
            'image_url': image_url,
            'source': 'fallback',
            'metadata': {
                'word': word,
                'type': 'static_fallback'
            }
        }
    
    def _build_image_prompt(self, word, etymology_context):
        """
        Build a prompt for image generation based on the word's etymology.
        """
        base_prompt = f"""
        Create a sophisticated, educational illustration in the style of medieval illuminated manuscripts 
        that represents the etymology of the word "{word}". 
        
        Style requirements:
        - Renaissance/medieval manuscript aesthetic with aged parchment background
        - Golden ornaments and decorative borders
        - Rich, warm colors (deep reds, golds, sepia tones)
        - Classical architectural elements or ancient symbols when appropriate
        - Educational and scholarly appearance
        
        Content should be:
        - Historically accurate representation of the word's origins
        - Elegant and academic in nature
        - Suitable for an educational etymology application
        - Free of text or modern elements
        """
        
        if etymology_context:
            base_prompt += f"\n\nEtymological context: {etymology_context}"
        
        return base_prompt
    
    def _log_api_usage(self, endpoint, request_data, response_data, success=True, error_message=''):
        """
        Log API usage for monitoring.
        """
        try:
            APIUsage.objects.create(
                service='openai',
                endpoint=endpoint,
                request_data=request_data,
                response_data=response_data,
                success=success,
                error_message=error_message
            )
        except Exception as e:
            logger.error(f"Failed to log API usage: {str(e)}")