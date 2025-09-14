// Configurações da aplicação
export const APP_CONFIG = {
  // URL da API
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 5,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
  },
  
  // Configurações de timeout
  TIMEOUT: {
    API_REQUEST: 10000, // 10 segundos
    TOAST_DURATION: 4000 // 4 segundos
  },
  
  // Configurações de autenticação
  AUTH: {
    TOKEN_KEY: 'authToken',
    REFRESH_TOKEN_KEY: 'refreshToken'
  },
  
  // Configurações de desenvolvimento
  DEV: {
    ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
    MOCK_API_RESPONSES: false // Set to true to use mock data instead of real API
  }
};

// Função para verificar se a API está disponível
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Função para obter a URL completa da API
export const getApiUrl = (endpoint: string): string => {
  return `${APP_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
