# Deploy do Frontend na Vercel

Este guia detalha o processo de deploy do frontend Veritas Radix na Vercel.

## 📋 Pré-requisitos

1. ✅ Backend Django já deployado no Render
2. ✅ Banco de dados configurado no Neon
3. ✅ Conta na Vercel
4. ✅ Repositório frontend separado no GitHub

## 🚀 Processo de Deploy

### 1. Preparação do Repositório

```bash
# Clone o repositório frontend
git clone https://github.com/seu-usuario/veritas-radix-frontend.git
cd veritas-radix-frontend

# Instale as dependências
npm install

# Teste localmente
npm run build
```

### 2. Configuração na Vercel

#### Via Dashboard da Vercel:

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Conecte**: Seu repositório GitHub
3. **Selecione**: `veritas-radix-frontend`
4. **Configure**: As variáveis de ambiente

#### Variáveis de Ambiente:
```env
# Obrigatórias
NEXT_PUBLIC_API_URL=https://veritas-radix-backend.onrender.com
NODE_ENV=production

# Opcionais (se configuradas)
NEXT_PUBLIC_GA_ID=seu-google-analytics-id
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Deploy via CLI (Alternativo)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Configure o projeto
vercel

# Deploy
vercel --prod
```

## ⚙️ Configurações Importantes

### vercel.json
O arquivo já está configurado com:
- Proxy das rotas `/api/*` para o backend
- Headers de segurança
- Configurações de CORS

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['veritas-radix-backend.onrender.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig
```

## 🔍 Verificação do Deploy

### 1. Teste das Funcionalidades
- [ ] Login de estudante/professor
- [ ] Pesquisa de palavras
- [ ] Análise morfológica
- [ ] Sistema de desafios
- [ ] Dashboard do professor
- [ ] Sistema de gamificação

### 2. Teste das APIs
```bash
# Teste a conexão com o backend
curl https://seu-app.vercel.app/api/etymology/analyze/ \
  -H "Content-Type: application/json" \
  -d '{"word": "teste"}'
```

### 3. Verificar Logs
- Acesse o dashboard da Vercel
- Vá em "Functions" > "View Function Logs"
- Monitore erros e performance

## 🛠️ Troubleshooting

### Problema: Erro de CORS
**Solução**: Verificar se o backend tem a URL do frontend nas configurações CORS

### Problema: API não encontrada
**Solução**: Verificar se `NEXT_PUBLIC_API_URL` está correta

### Problema: Build falha
```bash
# Limpar cache
rm -rf .next
npm run build
```

### Problema: Imagens não carregam
**Solução**: Adicionar domínios no `next.config.js`

## 📊 Monitoramento

### Analytics da Vercel
- Acesse: Dashboard > seu-projeto > Analytics
- Monitore: Page views, Performance, Core Web Vitals

### Logs de Erro
- Acesse: Dashboard > seu-projeto > Functions
- Monitore: Erros de runtime, timeouts

## 🔄 Atualizações

### Deploy Automático
- Todo push na branch `main` faz deploy automático
- Pull requests criam preview deployments

### Deploy Manual
```bash
vercel --prod
```

## 🌐 URLs de Produção

- **Frontend**: https://veritas-radix.vercel.app
- **Backend**: https://veritas-radix-backend.onrender.com
- **Banco**: Neon PostgreSQL (configurado no backend)

## 📱 PWA (Opcional)

Para transformar em PWA:
```bash
npm install next-pwa
```

Adicionar ao `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // sua configuração
})
```

## ✅ Checklist Final

- [ ] Build local funciona sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de API corretas
- [ ] CORS configurado no backend
- [ ] Deploy realizado com sucesso
- [ ] Todas as funcionalidades testadas
- [ ] Performance verificada
- [ ] SEO otimizado

---

🎉 **Deploy concluído!** Sua aplicação Veritas Radix está online e pronta para uso educacional.