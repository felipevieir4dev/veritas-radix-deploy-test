# Troubleshooting - Veritas Radix

## Common Issues and Solutions

### 🚨 "ReferenceError: process is not defined"

Este erro ocorre quando o código tenta acessar `process.env` no lado do cliente (browser).

**Solução:**
1. Copie o arquivo de exemplo:
   ```bash
   cp env.local.example .env.local
   ```

2. Configure as variáveis de ambiente no `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   ```

3. Certifique-se de que as variáveis de ambiente começam com `NEXT_PUBLIC_` para serem acessíveis no cliente.

4. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 🔧 Build Errors

Se encontrar erros durante o build:

1. Limpe o cache do Next.js:
   ```bash
   rm -rf .next
   npm run build
   ```

2. Verifique se todas as dependências estão instaladas:
   ```bash
   npm install
   ```

3. Verifique a configuração do TypeScript:
   ```bash
   npm run type-check
   ```

### 🌐 API Connection Issues

Se a aplicação não conseguir se conectar ao backend:

1. Verifique se o backend está rodando na porta 8000:
   ```bash
   curl http://localhost:8000/api/health/
   ```

2. Confirme a configuração da URL da API no `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Verifique se o CORS está configurado corretamente no backend.

### 📦 Dependency Issues

Se houver problemas com dependências:

1. Delete node_modules e reinstale:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Certifique-se de usar Node.js >= 18:
   ```bash
   node --version
   ```

3. Verifique se todas as dependências necessárias estão no package.json:
   - `@google/generative-ai` - para integração com Gemini
   - `next` - framework principal
   - `react` e `react-dom` - biblioteca de UI

### 🎨 Styling Issues

Se os estilos não estiverem funcionando corretamente:

1. Verifique se o Tailwind CSS está configurado corretamente
2. Confirme que o arquivo `styles/globals.css` está sendo importado
3. Limpe o cache do browser (Ctrl+F5 ou Cmd+Shift+R)

### 🔐 Environment Variables in Production

Para produção na Vercel:

1. Configure as variáveis no dashboard da Vercel:
   - `NEXT_PUBLIC_API_URL=https://veritas-radix-backend.onrender.com`
   - `GEMINI_API_KEY=sua-chave-aqui`
   - `OPENAI_API_KEY=sua-chave-aqui`

2. Redeploy a aplicação após configurar as variáveis.

### 📱 Mobile Issues

Se houver problemas na versão mobile:

1. Teste em diferentes navegadores mobile
2. Verifique se os breakpoints do Tailwind estão funcionando
3. Confirme que o viewport meta tag está presente no layout

### 🔍 Debug Tips

Para debug mais efetivo:

1. Use o console do browser (F12)
2. Verifique a aba Network para erros de API
3. Use `console.log` para debugar valores
4. Verifique os logs do servidor Next.js no terminal

### 📞 Getting Help

Se os problemas persistirem:

1. Verifique o arquivo `DEPLOY_SEPARATION_GUIDE.md` para instruções completas
2. Consulte a documentação do Next.js
3. Revise as configurações no `next.config.js`

---

## Quick Fix Commands

```bash
# Reset completo do projeto
rm -rf .next node_modules package-lock.json
npm install
cp env.local.example .env.local
npm run dev

# Verificar configuração
npm run type-check
npm run lint

# Build de produção
npm run build
npm run start
```