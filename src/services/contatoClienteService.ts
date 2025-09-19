import { ApiError } from './api';
import api from './api';

// Interface para contato de cliente baseada na tabela clientes_contatos
export interface ContatoCliente {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	clienteId: string;
	nome: string;
	email?: string;
	telefone?: string;
	whatsapp?: string;
	tipo: string[];
}

// Interface para criação de contato de cliente
export interface CreateContatoClienteData {
	nome: string;
	email?: string;
	telefone?: string;
	whatsapp?: string;
	tipo: string[];
}

class ContatoClienteService {
	/**
	 * Busca todos os contatos de um cliente específico
	 */
	async getContatosByClienteId(clienteId: string): Promise<ContatoCliente[]> {
		try {
			const response = await api.get<ContatoCliente[]>(`/clientes/${clienteId}/contatos`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar contatos do cliente');
		}
	}

	/**
	 * Cria um novo contato para um cliente específico
	 */
	async createContato(clienteId: string, contatoData: CreateContatoClienteData): Promise<ContatoCliente> {
		try {
			const response = await api.post<ContatoCliente>(`/clientes/${clienteId}/contatos`, contatoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao criar contato do cliente');
		}
	}

	/**
	 * Atualiza um contato específico de um cliente
	 */
	async updateContato(clienteId: string, contatoId: string, contatoData: CreateContatoClienteData): Promise<ContatoCliente> {
		try {
			const response = await api.put<ContatoCliente>(`/clientes/${clienteId}/contatos/${contatoId}`, contatoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao atualizar contato do cliente');
		}
	}

	/**
	 * Exclui um contato específico de um cliente
	 */
	async deleteContato(clienteId: string, contatoId: string): Promise<void> {
		try {
			await api.delete(`/clientes/${clienteId}/contatos/${contatoId}`);
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao excluir contato do cliente');
		}
	}
}

export const contatoClienteService = new ContatoClienteService();
