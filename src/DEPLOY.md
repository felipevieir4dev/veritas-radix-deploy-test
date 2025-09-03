# 🚀 Guia de Deploy - Veritas Radix na Vercel

## Pré-requisitos

### 1. Contas necessárias
- [Vercel](https://vercel.com) (gratuita)
- [Google AI Studio](https://aistudio.google.com) (para Gemini API)
- [OpenAI](https://platform.openai.com) (para DALL-E API)
- [GitHub](https://github.com) (para versionamento)

### 2. Obter APIs Keys

#### Google Gemini API Key
1. Acesse https://aistudio.google.com/app/apikey
2. Clique em "Create API Key"
3. Selecione um projeto ou crie um novo
4. Copie a chave gerada

#### OpenAI API Key (DALL-E)
1. Acesse https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Dê um nome para a chave
4. Copie a chave gerada (você só verá uma vez)

## 🔧 Preparação do Projeto

### 1. Estrutura de arquivos
Certifique-se de que seu projeto tem esta estrutura:
```
veritas-radix/
├── app/
│   ├── api/
│   │   ├── etymology/route.ts
│   │   └── generate-image/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   └── api.ts
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
```

### 3. Testar localmente
```bash
# Copie o arquivo .env.example
cp .env.example .env.local

# Adicione suas API keys no .env.local
GOOGLE_API_KEY=sua_chave_aqui
OPENAI_API_KEY=sua_chave_aqui

# Execute o projeto
npm run dev
```

## 🚀 Deploy na Vercel

### Método 1: GitHub + Vercel (Recomendado)

1. **Suba para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Veritas Radix"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/veritas-radix.git
   git push -u origin main
   ```

2. **Deploy na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente:
     - `GOOGLE_API_KEY`: Sua chave do Gemini
     - `OPENAI_API_KEY`: Sua chave da OpenAI

3. **Deploy automático:**
   - A cada push no GitHub, a Vercel fará deploy automaticamente
   - Acesse o link fornecido pela Vercel

### Método 2: Vercel CLI

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login e deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Configurar variáveis:**
   ```bash
   vercel env add GOOGLE_API_KEY
   vercel env add OPENAI_API_KEY
   ```

## 🔧 Configuração das Variáveis de Ambiente na Vercel

1. Acesse o dashboard do seu projeto na Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `GOOGLE_API_KEY` | sua_chave_do_gemini | Production, Preview, Development |
| `OPENAI_API_KEY` | sua_chave_da_openai | Production, Preview, Development |

## ⚙️ Configurações Adicionais

### Domínio Personalizado (Opcional)
1. No dashboard da Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

### Análise e Performance
1. A Vercel fornece analytics gratuitos
2. Acesse **Analytics** no dashboard para métricas
3. Configure **Web Vitals** para performance

## 🐛 Solução de Problemas

### Build Errors
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros TypeScript
- Confirme que as APIs keys estão configuradas

### API Errors
- Verifique se as chaves das APIs estão corretas
- Confirme se as APIs têm saldo/créditos suficientes
- Teste as rotas localmente primeiro

### Performance
- As APIs externas podem ser lentas
- Considere implementar cache/loading states
- Monitor os limites de rate das APIs

## 📊 Monitoramento

### Logs da Vercel
```bash
vercel logs https://seu-app.vercel.app
```

### Métricas importantes
- Response time das APIs
- Número de requisições
- Erros 4xx/5xx
- Web Vitals

## 💰 Custos

### Vercel
- **Hobby (Gratuito)**: Até 100GB bandwidth/mês
- **Pro ($20/mês)**: Recursos avançados

### Google Gemini
- **Gratuito**: 15 requisições/minuto
- **Pago**: Varia conforme uso

### OpenAI DALL-E
- **DALL-E 3**: ~$0.04 por imagem
- **Rate limits**: Varia por tier

## 🔒 Segurança

- ✅ APIs keys nunca no código
- ✅ Validação de input nas rotas
- ✅ Rate limiting implementado
- ✅ CORS configurado
- ✅ Headers de segurança

## 🚀 Próximos Passos

Após o deploy:

1. **Teste todas as funcionalidades**
2. **Configure domínio personalizado**
3. **Implemente analytics**
4. **Configure alertas de erro**
5. **Monitore custos das APIs**

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Gemini](https://ai.google.dev/docs)
- [Documentação OpenAI](https://platform.openai.com/docs)

---

🎉 **Parabéns! Sua aplicação Veritas Radix está no ar!**

Acesse: `https://seu-projeto.vercel.app`