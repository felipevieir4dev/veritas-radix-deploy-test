# Deploy do Frontend Veritas Radix na Vercel

## Configuração Inicial

### 1. Preparação do Repositório
1. Certifique-se de que o backend já está rodando no Render
2. Teste a URL da API: `https://veritas-radix-backend.onrender.com/api/`
3. Faça commit de todas as alterações no repositório

### 2. Deploy na Vercel
1. Acesse [Vercel](https://vercel.com) e faça login com GitHub
2. Clique em "New Project"
3. Selecione seu repositório do GitHub
4. Configure as seguintes opções:
   - **Project Name**: veritas-radix-frontend
   - **Framework**: Next.js
   - **Root Directory**: / (raiz do projeto)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

### 3. Variáveis de Ambiente na Vercel
No dashboard da Vercel, vá em Settings → Environment Variables e configure:

#### Obrigatórias:
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: `https://veritas-radix-backend.onrender.com`

#### Opcionais:
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`: Sua chave do Unsplash (se usar no frontend)
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN para monitoramento de erros

### 4. Configuração de Domínio (Opcional)
1. No dashboard da Vercel, vá em Settings → Domains
2. Adicione seu domínio customizado (ex: veritasradix.com)
3. Configure os DNS conforme instruções da Vercel

### 5. Deploy Automático
- A Vercel fará deploy automático a cada push na branch main
- Monitore o build nos logs da Vercel
- Teste todas as funcionalidades após o deploy

## URLs do Frontend
Após o deploy, seu frontend estará disponível em:
```
https://veritas-radix-frontend.vercel.app
```

Ou no seu domínio customizado:
```
https://veritasradix.com
```

## Integração com Backend
O frontend se comunicará com o backend através de:
```
Frontend (Vercel) → Backend (Render) → Database (Neon)
```

### Fluxo de dados:
1. Usuário interage com o frontend na Vercel
2. Frontend faz requisições AJAX para o backend no Render
3. Backend processa e consulta/atualiza banco no Neon
4. Backend retorna dados para o frontend
5. Frontend atualiza a interface

## Monitoramento e Analytics

### 1. Vercel Analytics
- Automaticamente ativo para projetos Pro
- Monitora performance e usage
- Acesse em Analytics no dashboard

### 2. Google Analytics (Opcional)
```javascript
// Adicione ao _app.tsx se configurado
import { GA_TRACKING_ID, pageview } from '../lib/gtag'

useEffect(() => {
  const handleRouteChange = (url) => {
    pageview(url)
  }
  router.events.on('routeChangeComplete', handleRouteChange)
  return () => {
    router.events.off('routeChangeComplete', handleRouteChange)
  }
}, [router.events])
```

### 3. Sentry (Opcional)
Para monitoramento de erros:
```javascript
// Adicione ao _app.tsx se configurado
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Otimizações de Performance

### 1. Imagens
- Use Next.js Image component para otimização automática
- Configure domínios permitidos no next.config.js

### 2. Bundle Analysis
```bash
# Analise o bundle size
npm run analyze

# Ou use o Vercel Bundle Analyzer
npx @next/bundle-analyzer
```

### 3. Core Web Vitals
- Monitore LCP, FID, CLS no Vercel Analytics
- Otimize componentes pesados com React.lazy()

## Troubleshooting

### Problemas Comuns:

1. **Erro de CORS**:
   - Verifique se o frontend está na lista CORS_ALLOWED_ORIGINS do backend
   - Confirme se as URLs estão corretas

2. **API não encontrada**:
   - Verifique se NEXT_PUBLIC_API_URL está correto
   - Teste a URL do backend manualmente

3. **Build falha**:
   - Verifique se todas as dependências estão no package.json
   - Confirme se não há imports de Node.js modules no cliente

4. **Hydration errors**:
   - Certifique-se de que SSR e CSR renderizam o mesmo conteúdo
   - Use useEffect para código que depende de window/localStorage

### Logs Úteis:
```bash
# Ver logs de build
vercel logs --follow

# Ver logs de função específica
vercel logs --follow [deployment-url]
```

## Backup e Rollback
- A Vercel mantém histórico de deployments
- Para rollback: vá em Deployments → clique em deployment anterior → Promote to Production
- Configure preview deployments para testar antes de promover

## Scripts Úteis

### package.json:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true next build",
    "type-check": "tsc --noEmit"
  }
}
```

### Deploy local para teste:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy de preview
vercel

# Deploy para produção
vercel --prod
```