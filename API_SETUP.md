# Configuração de APIs

## 1. Google AI API (Gemini)

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada
4. No Render, adicione a variável: `GOOGLE_AI_API_KEY=sua_chave_aqui`

## 2. OpenAI API

1. Acesse: https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave gerada
4. No Render, adicione a variável: `OPENAI_API_KEY=sua_chave_aqui`

## 3. Variáveis de Ambiente no Render

No dashboard do seu serviço no Render, vá em Environment e adicione:

```
DEBUG=False
DJANGO_SECRET_KEY=sua_chave_secreta_django
ALLOWED_HOST=veritas-radix-deploy-test.onrender.com
GOOGLE_AI_API_KEY=sua_chave_google
OPENAI_API_KEY=sua_chave_openai
```

## 4. Frontend na Vercel

No dashboard do projeto na Vercel, adicione as variáveis:

```
VITE_API_URL=https://veritas-radix-deploy-test.onrender.com
VITE_GOOGLE_AI_API_KEY=sua_chave_google
VITE_OPENAI_API_KEY=sua_chave_openai
```