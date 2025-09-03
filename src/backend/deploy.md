# Deploy do Backend Veritas Radix no Render

## Configuração Inicial

### 1. Banco de Dados Neon
1. Acesse [Neon](https://neon.tech) e crie uma conta
2. Crie um novo projeto chamado "veritas-radix"
3. Copie a connection string que será algo como:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### 2. Deploy no Render
1. Faça fork/clone deste repositório
2. Acesse [Render](https://render.com) e crie uma conta
3. Clique em "New +" → "Web Service"
4. Conecte seu repositório GitHub
5. Configure as seguintes opções:
   - **Name**: veritas-radix-backend
   - **Environment**: Python 3
   - **Region**: Escolha a mais próxima dos usuários
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn veritas_radix.wsgi:application`

### 3. Variáveis de Ambiente no Render
No dashboard do Render, configure as seguintes variáveis:

#### Obrigatórias:
- `DEBUG`: `False`
- `DJANGO_SECRET_KEY`: Gere uma chave segura
- `DATABASE_URL`: Connection string do Neon
- `ALLOWED_HOST`: `veritas-radix-backend.onrender.com`

#### APIs Externas:
- `GEMINI_API_KEY`: Sua chave do Google Gemini
- `OPENAI_API_KEY`: Sua chave da OpenAI
- `UNSPLASH_ACCESS_KEY`: Sua chave do Unsplash

#### Redis (Opcional - para cache):
- `REDIS_URL`: URL do Redis do Render (se usar o add-on)

### 4. Redis no Render (Opcional)
1. No dashboard, vá em "Add-ons"
2. Adicione "Render Redis"
3. A variável `REDIS_URL` será configurada automaticamente

### 5. Deploy Automático
- O deploy acontecerá automaticamente a cada push na branch main
- Monitore os logs durante o primeiro deploy
- Verifique se as migrações foram executadas corretamente

## URLs da API
Após o deploy, sua API estará disponível em:
```
https://veritas-radix-backend.onrender.com/api/
```

### Principais endpoints:
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registro
- `GET /api/etymology/analyze/` - Análise etimológica
- `POST /api/etymology/generate-image/` - Geração de imagens
- `GET /api/challenges/` - Lista de desafios
- `GET /api/admin/dashboard/` - Dashboard do professor

## Monitoramento
- Acesse os logs no dashboard do Render
- Configure alertas para downtime
- Monitore o uso de recursos

## Troubleshooting

### Problemas Comuns:
1. **Erro de migração**: Verifique se DATABASE_URL está correto
2. **Erro 500**: Verifique DJANGO_SECRET_KEY e DEBUG=False
3. **CORS errors**: Confirme se o frontend está na lista CORS_ALLOWED_ORIGINS
4. **APIs externas falham**: Verifique se as chaves estão configuradas

### Logs úteis:
```bash
# Ver logs em tempo real
render logs --service veritas-radix-backend --tail

# Ver logs específicos
render logs --service veritas-radix-backend --since 1h
```

## Backup do Banco
Configure backups automáticos no Neon:
1. Acesse o dashboard do Neon
2. Vá em "Backups"
3. Configure backup automático diário