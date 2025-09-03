# Veritas Radix - Frontend

Frontend da aplicação Veritas Radix para estudo de etimologia, desenvolvido com React, Next.js e Tailwind CSS.

## 🎨 Design

A aplicação possui um design que evoca manuscritos antigos e pergaminhos com ornamentos dourados:
- **Fonte principal**: EB Garamond
- **Cor padrão**: #8b0000 (vermelho profundo)
- **Fundo**: Pergaminho envelhecido com bordas enroladas
- **Paleta**: Bronze/dourada inspirada em manuscritos medievais

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **Next.js 14** - Framework React para produção
- **Tailwind CSS v4** - Framework CSS utilitário
- **TypeScript** - Tipagem estática
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Motion** - Animações

## 📱 Funcionalidades

### 6 Telas Principais:
1. **Login** - Autenticação de estudantes e professores
2. **Pesquisa** - Busca e análise de palavras
3. **Análise Morfológica** - Decomposição de palavras
4. **Desafios** - Sistema gamificado de exercícios
5. **Perfil** - Dashboard do usuário com progresso
6. **Árvore Etimológica** - Visualização das origens das palavras

### Sistema de Gamificação:
- Sistema completo de XP e níveis
- Medalhas e conquistas
- Desafios criativos com storytelling
- Ranking entre estudantes
- Dashboard gamificado

### Dashboard do Professor:
- Gestão de alunos e turmas
- Relatórios de progresso
- Estatísticas detalhadas
- Controle de desafios

## 🏗️ Arquitetura

Este é o frontend da aplicação Veritas Radix. A arquitetura completa inclui:

### Frontend (Este Repositório)
- **Framework**: Next.js 14 com React 18
- **Deploy**: Vercel
- **URL**: https://veritas-radix.vercel.app

### Backend (Repositório Separado)
- **Framework**: Django REST Framework
- **Deploy**: Render
- **URL**: https://veritas-radix-backend.onrender.com
- **Repositório**: [veritas-radix-backend](https://github.com/seu-usuario/veritas-radix-backend)

### APIs Integradas:
- **Gemini API** - Análise etimológica inteligente
- **DALL-E API** - Geração de imagens temáticas
- **Unsplash API** - Imagens de alta qualidade

### Banco de Dados:
- **Neon Database** - PostgreSQL gerenciado

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js ≥ 18.0.0
- npm ≥ 8.0.0

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/veritas-radix-frontend.git
cd veritas-radix-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local
```

### Configuração de Ambiente
Edite o arquivo `.env.local`:
```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# APIs Externas (para Next.js API routes)
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Ambiente
NODE_ENV=development
```

### Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção
```bash
npm run build
npm start
```

## 📦 Deploy

### Setup Automático de Produção
Execute o script de setup:
```bash
chmod +x setup-production.sh
./setup-production.sh
```

### Deploy Manual na Vercel
1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente no dashboard:
   - `NEXT_PUBLIC_API_URL`: https://veritas-radix-backend.onrender.com
   - `NEXT_PUBLIC_FRONTEND_URL`: https://veritas-radix.vercel.app
   - `GEMINI_API_KEY`: Sua chave da API Gemini
   - `OPENAI_API_KEY`: Sua chave da API OpenAI
   - `UNSPLASH_ACCESS_KEY`: Sua chave da API Unsplash

3. A aplicação será automaticamente deployada

### Verificação Pós-Deploy
Execute o script de verificação:
```bash
node verify-deployment.js
```

### Configuração Adicional
- O arquivo `vercel.json` já está configurado
- CORS está configurado no backend para permitir comunicação
- Next.js API routes lidam com integrações externas

### Guia Completo
Para instruções detalhadas de separação e deploy, consulte:
- `DEPLOY_SEPARATION_GUIDE.md` - Guia completo de separação e deploy
- `DEPLOY_FRONTEND_VERCEL.md` - Deploy específico do frontend

## 📂 Estrutura do Projeto

```
├── App.tsx                 # Componente principal da aplicação
├── components/             # Componentes React
│   ├── ui/                # Componentes da UI (ShadCN)
│   ├── ChallengesScreen.tsx
│   ├── EtymologyTreeScreen.tsx
│   ├── GamificationSystem.tsx
│   ├── LoginScreen.tsx
│   ├── MainScreen.tsx
│   ├── MorphologyScreen.tsx
│   ├── Navigation.tsx
│   ├── ProfileScreen.tsx
│   └── TeacherDashboard.tsx
├── lib/                   # Utilitários e configurações
│   ├── api.ts            # Cliente da API
│   └── config.ts         # Configurações
├── styles/               # Estilos globais
│   └── globals.css       # CSS do Tailwind v4
├── app/                  # Configuração do Next.js
│   ├── layout.tsx
│   └── page.tsx
├── guidelines/           # Documentação do projeto
└── package.json         # Dependências e scripts
```

## 🎯 Recursos de Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia aplicação em produção
- `npm run lint` - Executa o ESLint
- `npm run type-check` - Verifica tipos TypeScript

### Guias de Estilo
- Siga as diretrizes no arquivo `guidelines/Guidelines.md`
- Use componentes do ShadCN UI quando possível
- Mantenha consistência com o tema de pergaminho antigo
- Evite modificar as fontes e tamanhos padrão do CSS global

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Relacionados

- **Backend Repository**: [veritas-radix-backend](https://github.com/seu-usuario/veritas-radix-backend)
- **Demo Live**: [veritas-radix.vercel.app](https://veritas-radix.vercel.app)
- **Documentação**: [docs](./guidelines/Guidelines.md)

---

**Veritas Radix** - Descobrindo as raízes das palavras através da tecnologia.