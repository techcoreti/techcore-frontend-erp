import { ApiError } from './api';
import api from './api';

export interface LoginRequest {
	cnpj: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	user: {
		id: string;
		nome: string;
		email: string;
		tipoUsuario: string;
		empresaId: string;
	};
}

export interface User {
	id: string;
	nome: string;
	email: string;
	tipoUsuario: string;
	empresaId: string;
}

class AuthService {
	private readonly TOKEN_KEY = 'authToken';
	private readonly USER_KEY = 'user';
	private readonly EMPRESA_KEY = 'empresaId';

	/**
	 * Realiza login na API e retorna token JWT
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await api.post<LoginResponse>('/auth/login', credentials);

			// Salvar token e dados do usuário
			this.setToken(response.access_token);
			this.setUser(response.user);
			this.setEmpresaId(response.user.empresaId);

			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao realizar login');
		}
	}

	/**
	 * Realiza logout e limpa dados locais
	 */
	logout(): void {
		this.removeToken();
		this.removeUser();
		this.removeEmpresaId();
	}

	/**
	 * Verifica se o usuário está autenticado
	 */
	isAuthenticated(): boolean {
		const token = this.getToken();
		return !!token;
	}

	/**
	 * Obtém o token atual
	 */
	getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	/**
	 * Define o token no localStorage
	 */
	private setToken(token: string): void {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	/**
	 * Remove o token do localStorage
	 */
	private removeToken(): void {
		localStorage.removeItem(this.TOKEN_KEY);
	}

	/**
	 * Obtém dados do usuário atual
	 */
	getUser(): User | null {
		const userStr = localStorage.getItem(this.USER_KEY);
		return userStr ? JSON.parse(userStr) : null;
	}

	/**
	 * Define dados do usuário no localStorage
	 */
	private setUser(user: User): void {
		localStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	/**
	 * Remove dados do usuário do localStorage
	 */
	private removeUser(): void {
		localStorage.removeItem(this.USER_KEY);
	}

	/**
	 * Obtém o ID da empresa atual
	 */
	getEmpresaId(): string | null {
		return localStorage.getItem(this.EMPRESA_KEY);
	}

	/**
	 * Define o ID da empresa no localStorage
	 */
	private setEmpresaId(empresaId: string): void {
		localStorage.setItem(this.EMPRESA_KEY, empresaId);
	}

	/**
	 * Remove o ID da empresa do localStorage
	 */
	private removeEmpresaId(): void {
		localStorage.removeItem(this.EMPRESA_KEY);
	}

	/**
	 * Verifica se o token está expirado
	 */
	isTokenExpired(): boolean {
		const token = this.getToken();
		if (!token) return true;

		try {
			// Decodificar JWT (sem verificação de assinatura)
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Date.now() / 1000;

			return payload.exp < currentTime;
		} catch (error) {
			return true;
		}
	}
}

export const authService = new AuthService();
