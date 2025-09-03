# Guia de Deploy - Veritas Radix

## 1. Subir para o GitHub

### Inicializar repositório Git
```bash
cd "/home/felipe/Downloads/Veritas Radix-deploy-test"
git init
git add .
git commit -m "Initial commit"
```

### Criar repositório no GitHub
1. Acesse https://github.com/new
2. Nome: `veritas-radix`
3. Deixe público ou privado conforme preferir
4. NÃO inicialize com README (já temos um)

### Conectar e enviar código
```bash
git remote add origin https://github.com/SEU_USUARIO/veritas-radix.git
git branch -M main
git push -u origin main
```

## 2. Deploy do Frontend na Vercel

### Configurar variáveis de ambiente
Crie arquivo `.env.production` na raiz:
```
VITE_API_URL=https://seu-backend.onrender.com
VITE_GOOGLE_AI_API_KEY=sua_chave_aqui
VITE_OPENAI_API_KEY=sua_chave_aqui
```

### Deploy na Vercel
1. Acesse https://vercel.com
2. Conecte sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `veritas-radix`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `/` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Variáveis de ambiente na Vercel
No dashboard do projeto na Vercel:
1. Vá em Settings > Environment Variables
2. Adicione:
   - `VITE_API_URL`: URL do seu backend no Render
   - `VITE_GOOGLE_AI_API_KEY`: Sua chave da API do Google
   - `VITE_OPENAI_API_KEY`: Sua chave da API do OpenAI

## 3. Deploy do Backend no Render

### Preparar arquivos do backend
O backend já está configurado em `src/backend/` com:
- `requirements.txt`
- `render.yaml`
- `Procfile`

### Deploy no Render
1. Acesse https://render.com
2. Conecte sua conta GitHub
3. Clique em "New +" > "Web Service"
4. Selecione o repositório `veritas-radix`
5. Configure:
   - **Name**: `veritas-radix-backend`
   - **Root Directory**: `src/backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn veritas_radix.wsgi:application`

### Variáveis de ambiente no Render
No dashboard do serviço:
1. Vá em Environment
2. Adicione:
   - `DEBUG`: `False`
   - `SECRET_KEY`: Gere uma chave secreta
   - `DATABASE_URL`: Será fornecida automaticamente
   - `ALLOWED_HOSTS`: `seu-app.onrender.com,localhost`
   - `CORS_ALLOWED_ORIGINS`: `https://seu-frontend.vercel.app`
   - `GOOGLE_AI_API_KEY`: Sua chave da API do Google
   - `OPENAI_API_KEY`: Sua chave da API do OpenAI

### Banco de dados
1. No Render, crie um PostgreSQL database
2. Conecte ao seu web service
3. A `DATABASE_URL` será configurada automaticamente

## 4. Comandos úteis

### Desenvolvimento local
```bash
# Frontend
npm install
npm run dev

# Backend
cd src/backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Atualizar deploy
```bash
git add .
git commit -m "Update: descrição das mudanças"
git push origin main
```

## 5. URLs finais
- **Frontend**: https://seu-projeto.vercel.app
- **Backend**: https://seu-backend.onrender.com
- **Admin Django**: https://seu-backend.onrender.com/admin/

## Troubleshooting

### Erro de CORS
Certifique-se que a URL do frontend está em `CORS_ALLOWED_ORIGINS` no backend.

### Erro de build no Vercel
Verifique se todas as dependências estão no `package.json` e as variáveis de ambiente estão configuradas.

### Erro 500 no Render
Verifique os logs no dashboard do Render e certifique-se que todas as variáveis de ambiente estão configuradas.