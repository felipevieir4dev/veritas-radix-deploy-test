import { API_CONFIG } from './config';

interface EtymologyData {
  word: string;
  etymology: {
    origin: string;
    originalForm: string;
    meaning: string;
    evolution: string;
  };
  morphology: {
    prefix: string;
    root: string;
    suffix: string;
    explanation: string;
  };
  relatedWords: {
    word: string;
    relationship: string;
    explanation: string;
  }[];
  historicalContext: string;
  curiosities: string[];
}

interface EtymologyResponse {
  success: boolean;
  data: EtymologyData;
  rawResponse: string;
}

interface ImageResponse {
  success: boolean;
  imageUrl: string;
  prompt: string;
}

interface AuthResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    user_type: 'student' | 'teacher';
  };
  message?: string;
}

// Função utilitária para fazer requisições à API
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    // Adicionar token de autenticação se disponível
    ...(getAuthToken() && {
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
};

// Funções de autenticação
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// APIs de etimologia
export const analyzeEtymology = async (word: string): Promise<EtymologyResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.ETYMOLOGY, {
    method: 'POST',
    body: JSON.stringify({ word }),
  });
};

export const generateWordImage = async (word: string, etymology?: string): Promise<ImageResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.GENERATE_IMAGE, {
    method: 'POST',
    body: JSON.stringify({ word, etymology }),
  });
};

// APIs de autenticação
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  if (response.access_token) {
    setAuthToken(response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
  }
  
  return response;
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  user_type: 'student' | 'teacher';
}): Promise<AuthResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logout = async (): Promise<void> => {
  try {
    await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  } finally {
    removeAuthToken();
  }
};

// APIs de desafios
export const getChallenges = async (): Promise<any> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.CHALLENGES);
};

// APIs de perfil
export const getProfile = async (): Promise<any> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.PROFILE);
};

// APIs do dashboard administrativo
export const getAdminDashboard = async (): Promise<any> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.ADMIN);
};

// Função utilitária para lidar com erros de API
export const handleApiError = (error: any): string => {
  if (error?.response?.status === 429) {
    return 'Limite de requisições excedido. Tente novamente em alguns minutos.';
  }
  
  if (error?.response?.status === 400) {
    return 'Requisição inválida. Verifique os dados enviados.';
  }
  
  if (error?.response?.status === 500) {
    return 'Erro interno do servidor. Tente novamente mais tarde.';
  }
  
  if (error?.message?.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  return error?.message || 'Erro desconhecido. Tente novamente.';
};