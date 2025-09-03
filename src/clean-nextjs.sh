#!/bin/bash

# Script para limpar arquivos do Next.js após conversão para React

echo "🧹 Limpando arquivos do Next.js..."

# Remover diretório app/ do Next.js
if [ -d "app" ]; then
    echo "Removendo diretório app/"
    rm -rf app/
fi

# Remover next.config.js
if [ -f "next.config.js" ]; then
    echo "Removendo next.config.js"
    rm next.config.js
fi

# Remover vercel.json se existir
if [ -f "vercel.json" ]; then
    echo "Movendo vercel.json para vercel.json.backup"
    mv vercel.json vercel.json.backup
fi

# Remover App.tsx da raiz (agora está em src/)
if [ -f "App.tsx" ]; then
    echo "Removendo App.tsx da raiz (agora está em src/)"
    rm App.tsx
fi

# Remover arquivos de ambiente específicos do Next.js
if [ -f "env.local.example" ]; then
    echo "Removendo env.local.example (usando .env.example)"
    rm env.local.example
fi

if [ -f "env.production.example" ]; then
    echo "Removendo env.production.example"
    rm env.production.example
fi

# Criar arquivo .gitignore atualizado
echo "📝 Atualizando .gitignore para Vite..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.production
.env.development

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime
.pnp.*
.yarn/

# Temporary
.tmp/
.temp/

# Backup files
*.backup
vercel.json.backup

# Backend (em repositório separado)
backend/

# Legacy Next.js (após conversão)
.next/
out/
EOF

echo "✅ Limpeza concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute: npm install"
echo "2. Configure: cp .env.example .env.local"
echo "3. Execute: npm run dev"
echo ""
echo "🎉 Sua aplicação React está pronta!"