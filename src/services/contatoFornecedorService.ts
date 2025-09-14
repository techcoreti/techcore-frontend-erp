import api from './api';
import { ApiError } from './api';

export interface ContatoFornecedor {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	fornecedorId: string;
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

export interface CreateContatoFornecedorData {
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

class ContatoFornecedorService {
	/**
	 * Busca todos os contatos de um fornecedor específico
	 */
	async getContatosByFornecedorId(fornecedorId: string): Promise<ContatoFornecedor[]> {
		try {
			const response = await api.get<ContatoFornecedor[]>(`/fornecedores/${fornecedorId}/contatos`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar contatos do fornecedor');
		}
	}

	/**
	 * Cria um novo contato para um fornecedor específico
	 */
	async createContato(fornecedorId: string, contatoData: CreateContatoFornecedorData): Promise<ContatoFornecedor> {
		try {
			const response = await api.post<ContatoFornecedor>(`/fornecedores/${fornecedorId}/contatos`, contatoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao criar contato do fornecedor');
		}
	}

	/**
	 * Atualiza um contato específico de um fornecedor
	 */
	async updateContato(fornecedorId: string, contatoId: string, contatoData: CreateContatoFornecedorData): Promise<ContatoFornecedor> {
		try {
			const response = await api.put<ContatoFornecedor>(`/fornecedores/${fornecedorId}/contatos/${contatoId}`, contatoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao atualizar contato do fornecedor');
		}
	}

	/**
	 * Exclui um contato específico de um fornecedor
	 */
	async deleteContato(fornecedorId: string, contatoId: string): Promise<void> {
		try {
			await api.delete(`/fornecedores/${fornecedorId}/contatos/${contatoId}`);
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao excluir contato do fornecedor');
		}
	}
}

export const contatoFornecedorService = new ContatoFornecedorService();