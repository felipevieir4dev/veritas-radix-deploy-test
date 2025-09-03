# Guia de Separação e Deploy - Veritas Radix

Este guia detalha como separar o backend em um repositório independente e finalizar o deploy da aplicação Veritas Radix.

## 📋 Visão Geral da Arquitetura

- **Frontend**: React/Next.js → Deploy na Vercel
- **Backend**: Django REST API → Deploy no Render  
- **Database**: PostgreSQL → Neon
- **Cache**: Redis → Render Redis

## 🔄 Passo 1: Extrair Backend para Repositório Separado

### 1.1 Criar Novo Repositório
```bash
# No GitHub/GitLab, criar novo repositório: veritas-radix-backend
```

### 1.2 Preparar Diretório Backend
```bash
# Na raiz do projeto atual
cd backend/

# Inicializar git no diretório backend
git init
git add .
git commit -m "Initial backend setup"

# Conectar ao repositório remoto
git remote add origin https://github.com/seu-usuario/veritas-radix-backend.git
git branch -M main
git push -u origin main
```

### 1.3 Limpar Projeto Frontend
```bash
# Voltar para a raiz do projeto
cd ..

# Remover pasta backend do projeto frontend
rm -rf backend/

# Commit das mudanças no projeto frontend
git add .
git commit -m "Remove backend - moved to separate repository"
git push
```

## 🗄️ Passo 2: Configurar Database no Neon

### 2.1 Criar Database
1. Acesse [Neon Console](https://console.neon.tech/)
2. Criar novo projeto: `veritas-radix`
3. Copiar CONNECTION_STRING

### 2.2 Configurar Variáveis no Backend
No repositório backend, criar arquivo `.env`:
```env
# Database
DATABASE_URL=postgresql://usuario:senha@host:5432/veritas_radix

# Django
DEBUG=False
DJANGO_SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=veritas-radix-backend.onrender.com,localhost,127.0.0.1

# APIs Externas
GEMINI_API_KEY=sua-chave-gemini
OPENAI_API_KEY=sua-chave-openai

# Cache
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=https://veritas-radix.vercel.app,http://localhost:3000

# Email (opcional)
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

## 🚀 Passo 3: Deploy Backend no Render

### 3.1 Conectar Repositório
1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Criar "New Web Service"
3. Conectar repositório: `veritas-radix-backend`

### 3.2 Configurações do Serviço
```yaml
# Configurações automáticas via render.yaml
Name: veritas-radix-backend
Environment: Python 3.11
Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput
Start Command: gunicorn veritas_radix.wsgi:application
```

### 3.3 Configurar Variáveis de Ambiente
Adicionar no Render Dashboard:
- `DEBUG=False`
- `DJANGO_SECRET_KEY` (gerar nova)
- `DATABASE_URL` (do Neon)
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ALLOWED_HOSTS=veritas-radix-backend.onrender.com`
- `CORS_ALLOWED_ORIGINS=https://veritas-radix.vercel.app`

### 3.4 Adicionar Add-ons
- PostgreSQL: Conectar ao Neon
- Redis: Para cache (plano gratuito)

## 🌐 Passo 4: Deploy Frontend na Vercel

### 4.1 Configurar Variáveis de Ambiente
No dashboard da Vercel, adicionar:
```env
NEXT_PUBLIC_API_URL=https://veritas-radix-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://veritas-radix.vercel.app
```

### 4.2 Configurações de Build
O arquivo `vercel.json` já está configurado:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 4.3 Deploy Automático
```bash
# Conectar repositório frontend à Vercel
# Deploy automático será ativado para branch main
```

## 🔧 Passo 5: Configurar APIs Externas

### 5.1 Frontend (Next.js API Routes)
As rotas já estão configuradas em `/app/api/`:
- `/api/etymology/route.ts` - Integração Gemini
- `/api/generate-image/route.ts` - Integração DALL-E
- `/api/unsplash-image/route.ts` - Imagens Unsplash

### 5.2 Configurar Chaves de API
```env
# No Vercel (Frontend)
GEMINI_API_KEY=sua-chave-gemini
OPENAI_API_KEY=sua-chave-openai
UNSPLASH_ACCESS_KEY=sua-chave-unsplash

# No Render (Backend)
GEMINI_API_KEY=sua-chave-gemini
OPENAI_API_KEY=sua-chave-openai
```

## 🧪 Passo 6: Testes e Validação

### 6.1 Testar Backend
```bash
# URL do backend
https://veritas-radix-backend.onrender.com/api/health/

# Endpoints principais
GET /api/etymology/analyze/
POST /api/challenges/
GET /api/profile/
```

### 6.2 Testar Frontend
```bash
# URL do frontend
https://veritas-radix.vercel.app

# Funcionalidades principais
- Login/Cadastro
- Pesquisa etimológica
- Sistema de desafios
- Dashboard do professor
```

### 6.3 Testar Integração
- Verificar comunicação frontend ↔ backend
- Testar APIs externas (Gemini, DALL-E)
- Validar autenticação JWT
- Confirmar persistência no banco

## 📊 Passo 7: Monitoramento

### 7.1 Logs Backend (Render)
```bash
# Acessar logs via Render Dashboard
# Monitorar erros de inicialização
# Verificar conectividade com Neon
```

### 7.2 Logs Frontend (Vercel)
```bash
# Acessar Function Logs no Vercel
# Monitorar erros de API
# Verificar build logs
```

## 🔒 Passo 8: Configurações de Segurança

### 8.1 Backend Security Headers
```python
# Já configurado em settings.py
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

### 8.2 CORS Configuration
```python
# Atualizar CORS_ALLOWED_ORIGINS conforme necessário
CORS_ALLOWED_ORIGINS = [
    "https://veritas-radix.vercel.app",
    "http://localhost:3000",  # Para desenvolvimento
]
```

## 📈 Passo 9: Performance e Otimização

### 9.1 Backend Optimizations
- Configurado Django Redis para cache
- Static files via WhiteNoise
- Database connection pooling
- Gunicorn workers otimizados

### 9.2 Frontend Optimizations
- Next.js otimização automática
- Lazy loading de componentes
- Imagens otimizadas via Unsplash
- API routes para reduzir latência

## 🚨 Troubleshooting Comum

### Database Connection Issues
```bash
# Verificar DATABASE_URL no Render
# Confirmar whitelist do IP no Neon
# Testar conexão via psql
```

### CORS Errors
```bash
# Verificar CORS_ALLOWED_ORIGINS
# Confirmar URLs exatos (sem trailing slash)
# Testar via browser dev tools
```

### API Integration Issues
```bash
# Verificar chaves de API em ambos os ambientes
# Confirmar rate limits das APIs
# Testar endpoints individualmente
```

## ✅ Checklist Final

- [ ] Backend repository separado e funcionando
- [ ] Database Neon configurado e conectado
- [ ] Backend deployado no Render
- [ ] Frontend deployado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] APIs externas funcionando
- [ ] CORS configurado corretamente
- [ ] Testes de integração passando
- [ ] Monitoramento ativo
- [ ] Logs verificados
- [ ] Performance otimizada
- [ ] Segurança configurada

## 📞 Próximos Passos

1. **Backup Strategy**: Configurar backups automáticos do Neon
2. **Domain Setup**: Configurar domínio personalizado
3. **SSL Certificates**: Verificar HTTPS em produção  
4. **Analytics**: Implementar Google Analytics
5. **Error Tracking**: Configurar Sentry para monitoramento
6. **CI/CD**: Implementar testes automáticos
7. **Documentation**: Documentar APIs com Swagger
8. **Mobile Optimization**: Testar responsividade completa

---

🎉 **Parabéns!** O Veritas Radix está pronto para produção com arquitetura separada e escalável!