#!/usr/bin/env node

/**
 * Script de Verificação de Deploy - Veritas Radix
 * Verifica se todos os serviços estão funcionando corretamente
 */

const https = require('https');
const http = require('http');

// Configurações
const config = {
  frontend: {
    url: 'https://veritas-radix.vercel.app',
    name: 'Frontend (Vercel)'
  },
  backend: {
    url: 'https://veritas-radix-backend.onrender.com',
    name: 'Backend (Render)'
  },
  backendHealth: {
    url: 'https://veritas-radix-backend.onrender.com/api/health/',
    name: 'Backend Health Check'
  }
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  const client = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          responseTime,
          data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkEndpoint(endpoint) {
  try {
    log(`🔍 Verificando ${endpoint.name}...`, 'blue');
    
    const response = await makeRequest(endpoint.url);
    
    if (response.statusCode >= 200 && response.statusCode < 400) {
      log(`✅ ${endpoint.name}: OK (${response.statusCode}) - ${response.responseTime}ms`, 'green');
      return true;
    } else {
      log(`❌ ${endpoint.name}: ERRO (${response.statusCode}) - ${response.responseTime}ms`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${endpoint.name}: FALHA - ${error.message}`, 'red');
    return false;
  }
}

async function checkAPIIntegration() {
  try {
    log(`🔍 Verificando integração da API...`, 'blue');
    
    // Tentar fazer uma requisição para o endpoint de etimologia
    const testUrl = `${config.backend.url}/api/etymology/analyze/?word=teste`;
    const response = await makeRequest(testUrl);
    
    if (response.statusCode === 200 || response.statusCode === 401) {
      // 401 é esperado sem autenticação, significa que o endpoint existe
      log(`✅ API Integration: OK - Endpoint responde`, 'green');
      return true;
    } else {
      log(`❌ API Integration: ERRO (${response.statusCode})`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ API Integration: FALHA - ${error.message}`, 'red');
    return false;
  }
}

async function checkCORS() {
  try {
    log(`🔍 Verificando configuração CORS...`, 'blue');
    
    // Esta é uma verificação simples - CORS é melhor testado no browser
    const response = await makeRequest(`${config.backend.url}/api/health/`);
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];
    
    const hasCorsHeaders = corsHeaders.some(header => 
      response.headers && response.headers[header]
    );
    
    if (hasCorsHeaders) {
      log(`✅ CORS: OK - Headers configurados`, 'green');
      return true;
    } else {
      log(`⚠️  CORS: Headers não detectados (pode estar OK)`, 'yellow');
      return true; // Não falha por isso
    }
  } catch (error) {
    log(`❌ CORS Check: FALHA - ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 VERITAS RADIX - VERIFICAÇÃO DE DEPLOY', 'cyan');
  log('==========================================', 'cyan');
  
  const results = [];
  
  // Verificar endpoints principais
  for (const [key, endpoint] of Object.entries(config)) {
    const result = await checkEndpoint(endpoint);
    results.push({ name: endpoint.name, success: result });
    console.log(''); // Linha em branco
  }
  
  // Verificar integração da API
  const apiResult = await checkAPIIntegration();
  results.push({ name: 'API Integration', success: apiResult });
  console.log('');
  
  // Verificar CORS
  const corsResult = await checkCORS();
  results.push({ name: 'CORS Configuration', success: corsResult });
  console.log('');
  
  // Resumo
  log('📊 RESUMO DA VERIFICAÇÃO', 'cyan');
  log('========================', 'cyan');
  
  let allSuccess = true;
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`${status} ${result.name}`, color);
    if (!result.success) allSuccess = false;
  });
  
  console.log('');
  
  if (allSuccess) {
    log('🎉 DEPLOY BEM-SUCEDIDO! Todos os serviços estão funcionando.', 'green');
    log('🔗 Acesse: https://veritas-radix.vercel.app', 'blue');
  } else {
    log('⚠️  DEPLOY COM PROBLEMAS! Verifique os erros acima.', 'yellow');
    log('📚 Consulte o DEPLOY_SEPARATION_GUIDE.md para troubleshooting', 'blue');
  }
  
  console.log('');
  log('📝 Próximos passos:', 'blue');
  log('• Testar todas as funcionalidades manualmente', 'blue');
  log('• Configurar monitoramento e logs', 'blue');
  log('• Implementar domínio personalizado', 'blue');
  log('• Configurar backup do banco de dados', 'blue');
  
  process.exit(allSuccess ? 0 : 1);
}

// Executar verificação
main().catch(error => {
  log(`💥 Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});