// Configuração de ambiente segura para client e server
// Este arquivo lida com variáveis de ambiente de forma compatível com ambos os contextos

// Função helper para acessar variáveis de ambiente de forma segura
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Vite env vars (client-side e build-time)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  // Server-side ou Node.js (para compatibilidade)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // Client-side fallback
  return defaultValue;
};

// Detecta se está em produção baseado em múltiplos indicadores
export const isProduction = (): boolean => {
  // Browser detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return (
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app') ||
      hostname.includes('herokuapp.com') ||
      (hostname !== 'localhost' && 
       hostname !== '127.0.0.1' && 
       !hostname.startsWith('192.168.') &&
       !hostname.startsWith('10.') &&
       !hostname.includes('local'))
    );
  }
  
  // Server-side detection
  try {
    return getEnvVar('NODE_ENV') === 'production' || 
           getEnvVar('VERCEL_ENV') === 'production' ||
           getEnvVar('CUSTOM_NODE_ENV') === 'production';
  } catch {
    return false;
  }
};

// URLs de API baseadas no ambiente
export const API_URLS = {
  DEVELOPMENT: 'http://localhost:8000',
  PRODUCTION: 'https://veritas-radix-backend.onrender.com',
};

// Configuração principal da API
export const getApiUrl = (): string => {
  // Tentar usar variável específica primeiro (Vite usa VITE_ como prefixo)
  const envApiUrl = getEnvVar('VITE_API_URL') || getEnvVar('NEXT_PUBLIC_API_URL');
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Fallback baseado no ambiente
  return isProduction() ? API_URLS.PRODUCTION : API_URLS.DEVELOPMENT;
};

// Outras configurações de ambiente
export const ENV_CONFIG = {
  API_URL: getApiUrl(),
  IS_PRODUCTION: isProduction(),
  IS_DEVELOPMENT: !isProduction(),
  
  // Configurações de API externa (Vite env vars)
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY') || getEnvVar('GEMINI_API_KEY'),
  OPENAI_API_KEY: getEnvVar('VITE_OPENAI_API_KEY') || getEnvVar('OPENAI_API_KEY'),
  UNSPLASH_ACCESS_KEY: getEnvVar('VITE_UNSPLASH_ACCESS_KEY') || getEnvVar('UNSPLASH_ACCESS_KEY'),
  
  // Timeouts e limites
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};