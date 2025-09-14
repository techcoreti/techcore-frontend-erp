import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Interface para resposta padrão da API
export interface ApiResponse<T = any> {
	data: T;
	message?: string;
	status: number;
}

// Interface para erros da API
export interface ApiError {
	response: any
	message: string;
	status: number;
	details?: any;
}

// Classe principal para configuração da API
class ApiService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: API_BASE_URL,
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Interceptor para requisições - adiciona token JWT
		this.api.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem('token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Interceptor para respostas - tratamento de erros
		this.api.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			(error: AxiosError) => {
				this.handleError(error);
				return Promise.reject(error);
			}
		);
	}

	private handleError(error: AxiosError) {
		const status = error.response?.status;
		const message = (error.response?.data as any)?.message || error.message;

		switch (status) {
			case 401:
				// Token expirado ou inválido
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				window.location.href = '/login';
				toast.error('Sessão expirada. Faça login novamente.');
				break;
			case 403:
				toast.error('Acesso negado.');
				break;
			case 404:
				toast.error('Recurso não encontrado.');
				break;
			case 409:
				toast.error('Conflito: ' + message);
				break;
			case 422:
				toast.error('Dados inválidos: ' + message);
				break;
			case 500:
				toast.error('Erro interno do servidor.');
				break;
			default:
				toast.error(message || 'Erro na comunicação com o servidor.');
		}
	}

	// Métodos HTTP básicos
	async get<T>(url: string, params?: any): Promise<T> {
		const response = await this.api.get<T>(url, { params });
		return response.data;
	}

	async post<T>(url: string, data?: any): Promise<T> {
		const response = await this.api.post<T>(url, data);
		return response.data;
	}

	async put<T>(url: string, data?: any): Promise<T> {
		const response = await this.api.put<T>(url, data);
		return response.data;
	}

	async patch<T>(url: string, data?: any): Promise<T> {
		const response = await this.api.patch<T>(url, data);
		return response.data;
	}

	async delete<T>(url: string): Promise<T> {
		const response = await this.api.delete<T>(url);
		return response.data;
	}

	// Método para fazer upload de arquivos
	async upload<T>(url: string, formData: FormData): Promise<T> {
		const response = await this.api.post<T>(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	}

	// Método para definir token de autenticação
	setAuthToken(token: string) {
		this.api.defaults.headers.Authorization = `Bearer ${token}`;
	}

	// Método para remover token de autenticação
	removeAuthToken() {
		delete this.api.defaults.headers.Authorization;
	}
}

// Instância singleton da API
export const apiService = new ApiService();

// Exportar também a instância do axios para casos específicos
export default apiService;