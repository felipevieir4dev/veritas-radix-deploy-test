# Veritas Radix - Frontend React

Frontend da aplicação Veritas Radix para estudo de etimologia, convertido de Next.js para React puro com Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS v4** - Framework CSS utilitário
- **Radix UI** - Componentes UI acessíveis
- **Lucide React** - Ícones
- **Motion** - Animações
- **Recharts** - Gráficos

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd veritas-radix-frontend
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```bash
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=sua_chave_aqui
VITE_OPENAI_API_KEY=sua_chave_aqui
VITE_UNSPLASH_ACCESS_KEY=sua_chave_aqui
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`

### Build de produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

### Verificação de tipos
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📁 Estrutura de Arquivos

```
├── src/
│   ├── main.tsx          # Ponto de entrada
│   └── App.tsx           # Componente principal
├── components/           # Componentes React
├── lib/                  # Utilitários e configurações
├── styles/               # Estilos globais
├── public/               # Arquivos estáticos
├── index.html            # Template HTML
├── vite.config.ts        # Configuração do Vite
├── tailwind.config.js    # Configuração do Tailwind
└── tsconfig.json         # Configuração do TypeScript
```

## 🎨 Design System

A aplicação utiliza um design inspirado em manuscritos medievais com:

- **Fonte principal**: EB Garamond
- **Fonte decorativa**: Cinzel
- **Cor primária**: #8b0000 (Vermelho profundo)
- **Paleta**: Tons de pergaminho, sépia e dourado
- **Componentes**: Baseados em Radix UI com styling customizado

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure as variáveis de ambiente

### Outros provedores
1. Execute `npm run build`
2. Faça upload da pasta `dist/`
3. Configure servidor para SPA (single page application)

## 🔧 Configurações Importantes

### Variáveis de Ambiente
- Use prefixo `VITE_` para variáveis expostas no cliente
- Nunca commite chaves de API reais
- Use diferentes arquivos `.env` para cada ambiente

### TypeScript
- Configuração estrita habilitada
- Path mapping configurado para imports limpos
- Build falha em caso de erros de tipo

### Tailwind CSS
- Versão 4.0 (alpha)
- Configuração customizada para o tema
- Classes de utilitário personalizadas

## 🧪 Diferenças do Next.js

### Principais mudanças:
1. **Roteamento**: Gerenciado por estado interno (sem react-router)
2. **APIs**: Removidas (backend separado)
3. **Build**: Vite em vez de Webpack
4. **Dev server**: Vite dev server
5. **Variáveis de ambiente**: Prefixo `VITE_` em vez de `NEXT_PUBLIC_`

### Arquivos removidos:
- ❌ `next.config.js` - Não necessário com Vite
- ❌ `postcss.config.js` - Não necessário com Tailwind v4
- ❌ `tailwind.config.js` - Não necessário com Tailwind v4
- ❌ `app/` - Diretório do Next.js App Router

### Vantagens:
- ⚡ Dev server mais rápido
- 📦 Bundle menor
- 🔧 Configuração mais simples
- 🚀 Build mais rápida

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Verifica código com ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.