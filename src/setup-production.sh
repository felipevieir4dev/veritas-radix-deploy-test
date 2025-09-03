#!/bin/bash

# Script de Setup para Produção - Veritas Radix
# Execute este script após separar o backend

echo "🚀 Configurando Veritas Radix para Produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== VERITAS RADIX - SETUP DE PRODUÇÃO ===${NC}"

# Verificar se estamos na raiz do projeto frontend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto frontend!${NC}"
    exit 1
fi

# Verificar se a pasta backend ainda existe
if [ -d "backend" ]; then
    echo -e "${YELLOW}⚠️  Pasta backend ainda existe. Deseja removê-la? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}🗑️  Removendo pasta backend...${NC}"
        rm -rf backend/
        echo -e "${GREEN}✅ Pasta backend removida${NC}"
    fi
fi

# Criar arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}📝 Criando arquivo .env.local...${NC}"
    cat > .env.local << EOF
# Veritas Radix - Frontend Environment Variables

# API Configuration
NEXT_PUBLIC_API_URL=https://veritas-radix-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://veritas-radix.vercel.app

# External APIs (for Next.js API routes)
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Development
NEXT_PUBLIC_DEV_MODE=false
EOF
    echo -e "${GREEN}✅ Arquivo .env.local criado${NC}"
    echo -e "${YELLOW}⚠️  Lembre-se de configurar as chaves de API!${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env.local já existe${NC}"
fi

# Atualizar .gitignore se necessário
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo -e "${BLUE}📝 Atualizando .gitignore...${NC}"
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.production" >> .gitignore
    echo -e "${GREEN}✅ .gitignore atualizado${NC}"
fi

# Verificar dependências
echo -e "${BLUE}📦 Verificando dependências...${NC}"
if command -v npm &> /dev/null; then
    npm list --depth=0 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependências instaladas${NC}"
    else
        echo -e "${YELLOW}⚠️  Instalando dependências...${NC}"
        npm install
    fi
else
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi

# Executar build de teste
echo -e "${BLUE}🔨 Testando build...${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build executado com sucesso${NC}"
    # Limpar pasta de build
    rm -rf .next
else
    echo -e "${RED}❌ Falha no build - verifique os logs${NC}"
    echo -e "${YELLOW}Execute 'npm run build' para ver os detalhes${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup concluído!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "1. ${YELLOW}Configure as variáveis de ambiente em .env.local${NC}"
echo -e "2. ${YELLOW}Extraia o backend seguindo o DEPLOY_SEPARATION_GUIDE.md${NC}"
echo -e "3. ${YELLOW}Configure o backend no Render${NC}"
echo -e "4. ${YELLOW}Configure o frontend na Vercel${NC}"
echo -e "5. ${YELLOW}Configure o banco de dados no Neon${NC}"
echo ""
echo -e "${BLUE}📚 Documentação completa: DEPLOY_SEPARATION_GUIDE.md${NC}"
echo ""