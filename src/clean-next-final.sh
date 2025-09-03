#!/bin/bash

echo "🧹 Limpeza final dos arquivos Next.js remanescentes..."

# Remove arquivos do Next.js que não são mais necessários
echo "Removendo arquivos do Next.js..."
rm -f next.config.js
rm -f postcss.config.js  # Não necessário com Tailwind v4
rm -f tailwind.config.js # Não necessário com Tailwind v4
rm -rf app/              # Diretório app do Next.js
rm -f .env.development   # Usar apenas .env.local

echo "Removendo dependências antigas..."
rm -f package-lock.json
rm -rf node_modules

echo "✅ Limpeza final concluída!"

echo ""
echo "📋 Próximos passos:"
echo "1. Execute: npm install"
echo "2. Configure o arquivo .env.local baseado no .env.example"
echo "3. Execute: npm run dev"
echo ""
echo "🗂️  Estrutura final limpa:"
echo "   ├── src/"
echo "   │   ├── main.tsx"
echo "   │   └── App.tsx"
echo "   ├── components/"
echo "   ├── lib/"
echo "   ├── styles/"
echo "   ├── vite.config.ts"
echo "   └── package.json"