# Deploy Completo do Veritas Radix

Este guia detalha como fazer o deploy separado do frontend e backend do Veritas Radix, utilizando uma arquitetura moderna e escalável.

## Arquitetura de Deploy

```
Frontend (Vercel) ←→ Backend (Render) ←→ Database (Neon)
     React/Next.js      Django REST API      PostgreSQL
```

## 📁 Estrutura do Projeto

### Backend (`/backend/`)
- **Framework**: Django 4.2 + Django REST Framework
- **Banco de Dados**: PostgreSQL (Neon)
- **Cache**: Redis (Render Redis)
- **Deploy**: Render.com
- **APIs**: Gemini AI, OpenAI, Unsplash

### Frontend (`/`)
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS v4
- **Deploy**: Vercel
- **Comunicação**: HTTP REST APIs

## 🚀 Deploy do Backend (Render)

### 1. Configuração do Banco de Dados (Neon)

1. Acesse [Neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto: `veritas-radix`
3. Anote a connection string:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### 2. Deploy no Render

1. Faça push do código para GitHub
2. Acesse [Render.com](https://render.com) e conecte seu repositório
3. Configure o Web Service:
   - **Nome**: `veritas-radix-backend`
   - **Environment**: Python 3
   - **Root Directory**: `backend`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command**: 
     ```bash
     gunicorn veritas_radix.wsgi:application
     ```

### 3. Variáveis de Ambiente (Backend)

Configure no dashboard do Render:

```env
# Django
DEBUG=False
DJANGO_SECRET_KEY=seu-secret-key-super-seguro
ALLOWED_HOST=veritas-radix-backend.onrender.com

# Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# APIs Externas
GEMINI_API_KEY=sua-chave-gemini
OPENAI_API_KEY=sua-chave-openai
UNSPLASH_ACCESS_KEY=sua-chave-unsplash

# Redis (Auto-configurado se usar Render Redis)
REDIS_URL=redis://hostname:port
```

### 4. Adicionar Redis (Opcional)

1. No dashboard do Render, adicione o add-on "Render Redis"
2. A variável `REDIS_URL` será configurada automaticamente

## 🌐 Deploy do Frontend (Vercel)

### 1. Deploy na Vercel

1. Acesse [Vercel.com](https://vercel.com) e conecte seu repositório
2. Configure o projeto:
   - **Project Name**: `veritas-radix-frontend`
   - **Framework**: Next.js
   - **Root Directory**: `/` (raiz)
   - **Build Command**: `npm run build`

### 2. Variáveis de Ambiente (Frontend)

Configure no dashboard da Vercel:

```env
# API
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://veritas-radix-backend.onrender.com

# Opcionais
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=sua-chave-unsplash
NEXT_PUBLIC_GA_ID=seu-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=seu-sentry-dsn
```

## 🔧 Configuração de Comunicação

### CORS no Backend
O backend está configurado para aceitar requisições do frontend:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://veritas-radix-frontend.vercel.app",
    "https://seu-dominio-customizado.com",
]
```

### API Client no Frontend
O frontend usa a configuração centralizada:

```typescript
// lib/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://veritas-radix-backend.onrender.com' 
    : 'http://localhost:8000',
  // ...
}
```

## 📊 Endpoints da API

Após o deploy, a API estará disponível em:
`https://veritas-radix-backend.onrender.com/api/`

### Principais Endpoints:

- `POST /api/auth/login/` - Autenticação
- `POST /api/auth/register/` - Registro
- `GET /api/etymology/analyze/` - Análise etimológica
- `POST /api/etymology/generate-image/` - Geração de imagens
- `GET /api/challenges/` - Lista de desafios
- `GET /api/profile/` - Perfil do usuário
- `GET /api/admin/dashboard/` - Dashboard do professor

## 🔐 Segurança

### Backend
- HTTPS obrigatório em produção
- CORS configurado para domínios específicos
- Rate limiting nas APIs
- Autenticação JWT
- Validação de dados com serializers

### Frontend
- Variáveis sensíveis apenas no servidor
- Autenticação baseada em tokens
- Sanitização de inputs
- CSP headers via Vercel

## 📈 Monitoramento

### Backend (Render)
- Logs em tempo real
- Métricas de CPU/Memória
- Alertas de downtime
- Backup automático do banco (Neon)

### Frontend (Vercel)
- Analytics automático
- Core Web Vitals
- Error tracking (se Sentry configurado)
- Performance insights

## 🚨 Troubleshooting

### Problemas Comuns

1. **CORS Error**
   - Verifique se o domínio do frontend está em `CORS_ALLOWED_ORIGINS`
   - Confirme se as URLs estão corretas

2. **API 500 Error**
   - Verifique os logs no Render
   - Confirme se `DATABASE_URL` está correto
   - Verifique se as migrações foram executadas

3. **Build Error no Frontend**
   - Verifique se `NEXT_PUBLIC_API_URL` está configurado
   - Confirme se não há imports de módulos Node.js no cliente

4. **Timeout nas APIs**
   - Verifique se as chaves das APIs externas estão corretas
   - Monitore os rate limits do Gemini/OpenAI

### Comandos Úteis

```bash
# Logs do backend
render logs --service veritas-radix-backend --tail

# Deploy do frontend
vercel --prod

# Verificar build local
npm run build
npm start
```

## 💰 Custos Estimados

### Neon (Database)
- **Free Tier**: 3 GB, até 3 databases
- **Pro**: $19/mês (10 GB)

### Render (Backend)
- **Free Tier**: 512 MB RAM, sleeps após inatividade
- **Starter**: $7/mês (512 MB RAM, sempre ativo)

### Vercel (Frontend)
- **Hobby**: Gratuito (100 GB bandwidth)
- **Pro**: $20/mês (1 TB bandwidth)

### Total Mensal (Production Ready)
- ~$46/mês (Neon Pro + Render Starter + Vercel Pro)

## 🔄 CI/CD

### Deploy Automático
- **Backend**: Auto-deploy no push para `main`
- **Frontend**: Auto-deploy no push para `main`
- **Preview**: Branch deployments automáticos

### Pipeline Sugerido
1. Desenvolvimento local
2. Push para feature branch → Preview deploy
3. Merge para main → Production deploy
4. Monitoramento e alertas

## 📚 Próximos Passos

1. **Configurar domínio customizado**
2. **Implementar CI/CD avançado**
3. **Configurar monitoramento detalhado**
4. **Otimizar performance**
5. **Implementar backup strategy**
6. **Configurar staging environment**

---

## Links Úteis

- [Backend Deploy Guide](./backend/deploy.md)
- [Frontend Deploy Guide](./DEPLOY_FRONTEND.md)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)