import { ApiError } from './api';
import api from './api';

export interface Empresa {
	id: string;
	cnpj: string;
	razaoSocial: string;
	nomeFantasia: string;
	ativo: boolean;
	created_at: string;
	updated_at: string;
}

export interface UserProfile {
	id: string;
	nome: string;
	email: string;
	tipoUsuario: string;
	empresaId: string;
}

class EmpresaService {
	/**
	 * Buscar dados da empresa pelo ID
	 */
	async getById(id: string): Promise<Empresa> {
		try {
			const response = await api.get<Empresa>(`/empresas/${id}`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar dados da empresa');
		}
	}

	/**
	 * Buscar dados da empresa pelo CNPJ
	 */
	async getByCnpj(cnpj: string): Promise<Empresa> {
		try {
			const response = await api.get<Empresa>(`/empresas/cnpj/${cnpj}`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar empresa por CNPJ');
		}
	}

	/**
	 * Buscar perfil do usuário logado
	 */
	async getProfile(): Promise<UserProfile> {
		try {
			const response = await api.get<UserProfile>('/profile');
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar perfil do usuário');
		}
	}

	/**
	 * Buscar dados da empresa do usuário logado
	 */
	async getEmpresaLogada(): Promise<Empresa> {
		try {
			const response = await api.get<Empresa>('/auth/empresa');
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar dados da empresa');
		}
	}
}

export const empresaService = new EmpresaService();
