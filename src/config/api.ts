// Arquivo de configuração centralizada para a API
export const API_CONFIG = {
	BASE_URL: 'http://localhost:3000/api',
	TIMEOUT: 10000,
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
};

// Configurações de paginação padrão
export const PAGINATION_CONFIG = {
	DEFAULT_PAGE_SIZE: 10,
	PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
	MAX_PAGE_SIZE: 100,
};

// Configurações de cache
export const CACHE_CONFIG = {
	DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
	MAX_CACHE_SIZE: 100,
};

// Configurações de toast
export const TOAST_CONFIG = {
	DURATION: 4000,
	POSITION: 'top-right' as const,
};

// Configurações de validação
export const VALIDATION_CONFIG = {
	CPF_PATTERN: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
	CNPJ_PATTERN: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
	EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	PHONE_PATTERN: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
	CEP_PATTERN: /^\d{5}-\d{3}$/,
};

// Configurações de máscaras
export const MASK_CONFIG = {
	CPF: '000.000.000-00',
	CNPJ: '00.000.000/0000-00',
	PHONE: '(00) 00000-0000',
	CEP: '00000-000',
};

// Configurações de status
export const STATUS_CONFIG = {
	VENDA: {
		PENDENTE: 'Pendente',
		CONCLUIDA: 'Concluida',
		CANCELADA: 'Cancelada',
	},
	USUARIO: {
		ATIVO: 'ativo',
		INATIVO: 'inativo',
		BLOQUEADO: 'bloqueado',
	},
	TIPO_USUARIO: {
		ADMIN: 'admin',
		GERENTE: 'gerente',
		VENDEDOR: 'vendedor',
		CAIXA: 'caixa',
		ESTOQUE: 'estoque',
	},
};

// Configurações de cores para status
export const STATUS_COLORS = {
	SUCCESS: 'bg-green-100 text-green-800',
	WARNING: 'bg-yellow-100 text-yellow-800',
	ERROR: 'bg-red-100 text-red-800',
	INFO: 'bg-blue-100 text-blue-800',
	NEUTRAL: 'bg-gray-100 text-gray-800',
};

// Configurações de ícones
export const ICON_CONFIG = {
	STATUS: {
		SUCCESS: 'CheckCircle',
		WARNING: 'AlertTriangle',
		ERROR: 'XCircle',
		INFO: 'Info',
	},
	ACTIONS: {
		CREATE: 'Plus',
		EDIT: 'Edit',
		DELETE: 'Trash2',
		VIEW: 'Eye',
		SAVE: 'Save',
		CANCEL: 'X',
	},
};

// Configurações de endpoints
export const ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		PROFILE: '/perfil',
	},
	USUARIOS: '/usuarios',
	PARCEIROS: '/parceiros',
	EMPRESAS: '/empresas',
	CLIENTES: '/clientes',
	FORNECEDORES: '/fornecedores',
	PRODUTOS: '/produtos',
	ESTOQUE: '/estoque',
	TIPOS_ESTOQUE: '/estoques-tipos',
	MOVIMENTOS_ESTOQUE: '/estoque-movimentos',
	VENDAS: '/vendas',
	HEALTH: '/health',
};

// Configurações de headers
export const HEADERS = {
	CONTENT_TYPE: 'application/json',
	AUTHORIZATION: 'Bearer',
};

// Configurações de ambiente
export const ENV_CONFIG = {
	DEVELOPMENT: {
		API_URL: 'http://localhost:3000/api',
		DEBUG: true,
	},
	PRODUCTION: {
		API_URL: process.env.REACT_APP_API_URL || 'https://api.techcore.com.br/api',
		DEBUG: false,
	},
};

// Função para obter configuração baseada no ambiente
export const getConfig = () => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	return isDevelopment ? ENV_CONFIG.DEVELOPMENT : ENV_CONFIG.PRODUCTION;
};

// Função para formatar URLs
export const formatUrl = (endpoint: string, params?: Record<string, string | number>) => {
	let url = endpoint;

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url = url.replace(`:${key}`, String(value));
		});
	}

	return url;
};

// Função para validar CPF
export const validateCPF = (cpf: string): boolean => {
	const numbers = cpf.replace(/\D/g, '');

	if (numbers.length !== 11) return false;
	if (/^(\d)\1{10}$/.test(numbers)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(numbers[i]) * (10 - i);
	}
	let remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(numbers[9])) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(numbers[i]) * (11 - i);
	}
	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(numbers[10])) return false;

	return true;
};

// Função para validar CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
	const numbers = cnpj.replace(/\D/g, '');

	if (numbers.length !== 14) return false;
	if (/^(\d)\1{13}$/.test(numbers)) return false;

	let sum = 0;
	let weight = 2;
	for (let i = 11; i >= 0; i--) {
		sum += parseInt(numbers[i]) * weight;
		weight = weight === 9 ? 2 : weight + 1;
	}
	let remainder = sum % 11;
	const firstDigit = remainder < 2 ? 0 : 11 - remainder;
	if (firstDigit !== parseInt(numbers[12])) return false;

	sum = 0;
	weight = 2;
	for (let i = 12; i >= 0; i--) {
		sum += parseInt(numbers[i]) * weight;
		weight = weight === 9 ? 2 : weight + 1;
	}
	remainder = sum % 11;
	const secondDigit = remainder < 2 ? 0 : 11 - remainder;
	if (secondDigit !== parseInt(numbers[13])) return false;

	return true;
};

// Função para formatar CPF/CNPJ
export const formatCPFCNPJ = (value: string): string => {
	const numbers = value.replace(/\D/g, '');

	if (numbers.length <= 11) {
		// CPF
		return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	} else {
		// CNPJ
		return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
	}
};

// Função para formatar telefone
export const formatPhone = (value: string): string => {
	const numbers = value.replace(/\D/g, '');

	if (numbers.length <= 10) {
		return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	} else {
		return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
	}
};

// Função para formatar CEP
export const formatCEP = (value: string): string => {
	const numbers = value.replace(/\D/g, '');
	return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Função para formatar moeda
export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

// Função para formatar data
export const formatDate = (date: string | Date): string => {
	const d = new Date(date);
	return d.toLocaleDateString('pt-BR');
};

// Função para formatar data e hora
export const formatDateTime = (date: string | Date): string => {
	const d = new Date(date);
	return d.toLocaleString('pt-BR');
};
