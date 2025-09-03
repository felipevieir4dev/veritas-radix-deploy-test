# 🏛️ Veritas Radix Backend

**Backend Django para aplicação de etimologia com IA**

Sistema completo com Django REST Framework, PostgreSQL, integração com Gemini AI (Google) e DALL-E (OpenAI) para análise etimológica e geração de imagens.

## 🚀 **Funcionalidades**

### **🔬 Análise Etimológica**
- **Integração com Gemini AI** para análise detalhada de palavras
- Decomposição morfológica (prefixo, raiz, sufixo)
- Contexto histórico e evolução semântica
- Cache inteligente para otimização de performance
- Sistema de correções colaborativo

### **🎨 Geração de Imagens**
- **Integração com DALL-E** para imagens temáticas
- Fallback para Unsplash API
- Imagens estáticas garantidas
- Sistema de atribuição e metadados

### **👤 Sistema de Usuários**
- Autenticação JWT
- Perfis personalizados
- Sistema de gamificação (pontos, níveis, conquistas)
- Analytics de aprendizado

### **📊 Analytics e Monitoramento**
- Tracking de uso de APIs
- Métricas de performance
- Rate limiting inteligente
- Health checks completos

## 🛠️ **Tecnologias**

- **Framework**: Django 4.2 + Django REST Framework
- **Banco de Dados**: PostgreSQL 15
- **Cache**: Redis
- **IA**: Google Gemini Pro + OpenAI DALL-E 3
- **Deploy**: Docker + Gunicorn
- **Monitoramento**: Sentry + Logs estruturados

## ⚡ **Quick Start**

### **1. Clone e Configure**
```bash
git clone <repo-url>
cd backend

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale dependências
pip install -r requirements.txt
```

### **2. Configure Variáveis de Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas API keys
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
DJANGO_SECRET_KEY=your_secret_key_here
```

### **3. Banco de Dados**
```bash
# Criar banco PostgreSQL
createdb veritas_radix

# Migrar tabelas
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Carregar dados iniciais
python manage.py loaddata initial_data.json
```

### **4. Executar**
```bash
# Servidor de desenvolvimento
python manage.py runserver

# Com Docker (recomendado)
docker-compose up --build
```

## 🐳 **Deploy com Docker**

### **Desenvolvimento**
```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f web

# Migrar banco
docker-compose exec web python manage.py migrate

# Acessar shell
docker-compose exec web python manage.py shell
```

### **Produção**
```bash
# Build da imagem
docker build -t veritas-radix-backend .

# Deploy (exemplo com Railway/Render)
# Configure as variáveis de ambiente no painel
# A imagem será construída automaticamente
```

## 📡 **Endpoints da API**

### **🔐 Autenticação**
```bash
POST /api/v1/auth/register/          # Registro
POST /api/v1/auth/token/             # Login (JWT)
POST /api/v1/auth/token/refresh/     # Refresh token
GET  /api/v1/auth/profile/           # Perfil do usuário
PUT  /api/v1/auth/profile/           # Atualizar perfil
```

### **📚 Etimologia**
```bash
POST /api/v1/etymology/analyses/analyze/     # Analisar palavra
GET  /api/v1/etymology/analyses/             # Listar análises
GET  /api/v1/etymology/analyses/popular/     # Palavras populares
GET  /api/v1/etymology/analyses/featured/    # Palavras em destaque
POST /api/v1/etymology/analyses/{id}/bookmark/  # Favoritar
```

### **🖼️ Imagens**
```bash
POST /api/v1/etymology/images/generate/      # Gerar imagem
GET  /api/v1/etymology/images/               # Listar imagens
```

### **🎯 Desafios**
```bash
GET  /api/v1/challenges/                     # Listar desafios
POST /api/v1/challenges/{id}/start/          # Iniciar desafio
POST /api/v1/challenges/{id}/submit/         # Enviar resposta
```

## 🧪 **Exemplo de Uso**

### **Análise Etimológica**
```python
import requests

# Analisar uma palavra
response = requests.post('http://localhost:8000/api/v1/etymology/analyses/analyze/', 
    json={'word': 'filosofia'},
    headers={'Authorization': 'Bearer YOUR_JWT_TOKEN'}
)

data = response.json()
print(f"Origem: {data['data']['original_language']}")
print(f"Raiz: {data['data']['root']} ({data['data']['root_meaning']})")
```

### **Geração de Imagem**
```python
# Gerar imagem temática
response = requests.post('http://localhost:8000/api/v1/etymology/images/generate/',
    json={
        'word': 'filosofia',
        'etymology': 'Do grego antigo, amor pela sabedoria'
    },
    headers={'Authorization': 'Bearer YOUR_JWT_TOKEN'}
)

image_data = response.json()
print(f"Imagem: {image_data['imageUrl']}")
```

## ⚙️ **Configuração Avançada**

### **Rate Limiting**
```python
# Em settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'gemini_api': '50/hour',
        'dalle_api': '20/hour',
        'user': '1000/hour'
    }
}
```

### **Cache Personalizado**
```python
# Configurar TTL por tipo de conteúdo
CACHE_TTL = {
    'ETYMOLOGY_ANALYSIS': 60 * 60 * 24,  # 24 horas
    'FEATURED_WORDS': 60 * 60 * 6,       # 6 horas
    'USER_STATS': 60 * 15,               # 15 minutos
}
```

### **Monitoramento**
```python
# Health check
GET /health/

# Resposta
{
    "status": "healthy",
    "checks": {
        "database": "healthy",
        "cache": "healthy",
        "external_apis": {
            "gemini": "configured",
            "openai": "configured"
        }
    }
}
```

## 📊 **Monitoramento e Analytics**

### **Métricas Disponíveis**
- Número de análises etimológicas
- Taxa de sucesso das APIs
- Tempo médio de resposta
- Palavras mais buscadas
- Usuários ativos
- Uso de recursos (tokens, imagens)

### **Dashboards**
- Django Admin personalizado
- Métricas em tempo real
- Relatórios de uso de API
- Analytics de usuários

## 🔧 **Troubleshooting**

### **Problemas Comuns**

**1. Erro de API Key**
```bash
# Verifique se as keys estão configuradas
python manage.py shell
>>> from django.conf import settings
>>> print(settings.GEMINI_API_KEY)
```

**2. Banco de Dados não conecta**
```bash
# Teste a conexão
python manage.py dbshell
```

**3. Redis não conecta**
```bash
# Teste o cache
python manage.py shell
>>> from django.core.cache import cache
>>> cache.set('test', 'ok')
>>> cache.get('test')
```

**4. APIs externas falhando**
```bash
# Verifique os logs
docker-compose logs -f web

# Teste manualmente
GET /health/
```

## 🚀 **Deploy em Produção**

### **Heroku**
```bash
# Instalar CLI do Heroku
heroku create veritas-radix-backend

# Configurar add-ons
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# Configurar variáveis
heroku config:set DJANGO_SECRET_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
heroku run python manage.py migrate
```

### **Railway**
```bash
# railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn veritas_radix.wsgi"
  }
}
```

### **DigitalOcean/AWS**
```bash
# Docker deployment
docker run -d \
  --name veritas-radix-backend \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e GEMINI_API_KEY=... \
  veritas-radix-backend
```

## 📚 **Documentação da API**

Acesse `/api/docs/` para documentação interativa da API com Swagger.

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está licenciado sob a MIT License.

---

**Veritas Radix Backend** - *A verdade nas raízes das palavras* 🏛️✨