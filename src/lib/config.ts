import { ENV_CONFIG } from './env';

// Configuração da API
export const API_CONFIG = {
  // URL base da API
  BASE_URL: ENV_CONFIG.API_URL,
  
  // Endpoints
  ENDPOINTS: {
    ETYMOLOGY: '/api/etymology/analyze/',
    GENERATE_IMAGE: '/api/etymology/generate-image/',
    AUTH: {
      LOGIN: '/api/auth/login/',
      REGISTER: '/api/auth/register/',
      REFRESH: '/api/auth/refresh/',
      LOGOUT: '/api/auth/logout/',
    },
    CHALLENGES: '/api/challenges/',
    PROFILE: '/api/profile/',
    ADMIN: '/api/admin/dashboard/',
  },
  
  // Configurações de timeout
  TIMEOUT: 30000, // 30 segundos
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};