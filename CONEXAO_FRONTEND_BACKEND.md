# Conexão Frontend-Backend - Veritas Radix

## 1. Configuração da API

### Frontend (React)
```typescript
// src/lib/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'https://veritas-radix-deploy-test.onrender.com',
  ENDPOINTS: {
    ETYMOLOGY: '/api/etymology/analyze/',
  }
};
```

### Variáveis de Ambiente (Vercel)
```bash
VITE_API_URL=https://veritas-radix-deploy-test.onrender.com
```

## 2. Componente de Busca

### EtymologySearch.tsx
```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch(`${API_URL}/api/etymology/analyze/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: word.trim() }),
    });

    const data = await response.json();
    setResult(data);
  } catch (error) {
    setError('Erro na conexão com o servidor');
  }
};
```

## 3. Backend (Django)

### URL Configuration
```python
# veritas_radix/urls.py
urlpatterns = [
    path('api/etymology/analyze/', test_etymology),
]
```

### View Function
```python
def test_etymology(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        word = data.get('word', '')
        
        # Simulação básica
        analysis = {
            'word': word,
            'original_language': 'Latim',
            'etymology_explanation': f'A palavra "{word}" tem origem latina.',
        }
        
        return JsonResponse({
            'success': True,
            'analysis': analysis,
            'message': 'Análise concluída'
        })
```

## 4. Fluxo Completo

### Passo a Passo
1. **Usuário digita palavra** no frontend
2. **Frontend valida** entrada
3. **Requisição POST** para `/api/etymology/analyze/`
4. **Backend processa** com IA (futuro)
5. **Retorna JSON** estruturado
6. **Frontend exibe** resultado formatado

### Estrutura da Requisição
```json
// Request
{
  "word": "amor"
}

// Response
{
  "success": true,
  "analysis": {
    "word": "amor",
    "original_language": "Latim",
    "etymology_explanation": "A palavra 'amor' tem origem latina...",
    "prefix": "",
    "root": "am-",
    "suffix": "-or",
    "related_words": ["amar", "amável", "amizade"]
  },
  "message": "Análise concluída"
}
```

## 5. Tratamento de Erros

### Frontend
```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }
  
  const data = await response.json();
} catch (error) {
  setError('Erro na conexão');
}
```

### Backend
```python
try:
    data = json.loads(request.body)
    # Processar...
except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)
```

## 6. CORS Configuration

### Backend Settings
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://veritas-radix-deploy-test-m9ayc1cas.vercel.app",
    "http://localhost:3000",
]
```

## 7. Deploy e Teste

### URLs de Teste
- **Frontend:** https://veritas-radix-deploy-test-m9ayc1cas.vercel.app/
- **Backend:** https://veritas-radix-deploy-test.onrender.com/
- **API:** https://veritas-radix-deploy-test.onrender.com/api/etymology/analyze/

### Teste Manual
```bash
curl -X POST https://veritas-radix-deploy-test.onrender.com/api/etymology/analyze/ \
  -H "Content-Type: application/json" \
  -d '{"word": "amor"}'
```

## 8. Próximos Passos

1. **Integrar IA real** (Gemini AI)
2. **Adicionar autenticação** JWT
3. **Implementar cache** Redis
4. **Salvar histórico** no banco
5. **Adicionar rate limiting**