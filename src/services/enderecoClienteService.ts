import api from './api';
import { ApiError } from './api';

export interface EnderecoCliente {
	id: string;
	empresaId: string;
	clienteId: string;
	cep: string;
	logradouro: string;
	complemento?: string;
	numero: string;
	municipio: string;
	municipioCodigo: string;
	bairro: string;
	uf: string;
	ufCodigo: string;
	pais: string;
	paisCodigo: string;
	tipo: string[];
	ativo: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateEnderecoData {
	cep: string;
	logradouro: string;
	complemento?: string;
	numero: string;
	municipio: string;
	municipioCodigo: string;
	bairro: string;
	uf: string;
	ufCodigo: string;
	pais: string;
	paisCodigo: string;
	tipo: string[];
	ativo: boolean;
}

class EnderecoClienteService {
	/**
	 * Busca todos os endereços de um cliente específico
	 */
	async getEnderecosByClienteId(clienteId: string): Promise<EnderecoCliente[]> {
		try {
			const response = await api.get<EnderecoCliente[]>(`/clientes/${clienteId}/enderecos`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar endereços do cliente');
		}
	}

	/**
	 * Cria um novo endereço para um cliente específico
	 */
	async createEndereco(clienteId: string, enderecoData: CreateEnderecoData): Promise<EnderecoCliente> {
		try {
			const response = await api.post<EnderecoCliente>(`/clientes/${clienteId}/enderecos`, enderecoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao criar endereço do cliente');
		}
	}

	/**
	 * Atualiza um endereço específico de um cliente
	 */
	async updateEndereco(clienteId: string, enderecoId: string, enderecoData: CreateEnderecoData): Promise<EnderecoCliente> {
		try {
			const response = await api.put<EnderecoCliente>(`/clientes/${clienteId}/enderecos/${enderecoId}`, enderecoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao atualizar endereço do cliente');
		}
	}

	/**
	 * Exclui um endereço específico de um cliente
	 */
	async deleteEndereco(clienteId: string, enderecoId: string): Promise<void> {
		try {
			await api.delete(`/clientes/${clienteId}/enderecos/${enderecoId}`);
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao excluir endereço do cliente');
		}
	}
}

export const enderecoClienteService = new EnderecoClienteService();
