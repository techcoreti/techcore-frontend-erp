import api, { ApiError } from './api';

// Interface para endereço de fornecedor baseada na tabela fornecedores_enderecos
export interface EnderecoFornecedor {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	fornecedorId: string;
	cep: string;
	logradouro: string;
	complemento?: string;
	numero?: string;
	municipio: string;
	municipioCodigo: string;
	bairro?: string;
	uf: string;
	ufCodigo: string;
	pais: string;
	paisCodigo: string;
	tipo: string[];
	ativo: boolean;
}

// Interface para criação de endereço de fornecedor
export interface CreateEnderecoFornecedorData {
	cep: string;
	logradouro: string;
	numero?: string;
	complemento?: string;
	bairro?: string;
	municipio: string;
	municipioCodigo: string;
	uf: string;
	ufCodigo: string;
	pais: string;
	paisCodigo: string;
	tipo: string[];
	ativo: boolean;
}

class EnderecoFornecedorService {
	/**
	 * Busca todos os endereços de um fornecedor específico
	 */
	async getEnderecosByFornecedorId(fornecedorId: string): Promise<EnderecoFornecedor[]> {
		try {
			const response = await api.get<EnderecoFornecedor[]>(`/fornecedores/${fornecedorId}/enderecos`);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar endereços do fornecedor');
		}
	}

	/**
	 * Cria um novo endereço para um fornecedor específico
	 */
	async createEndereco(fornecedorId: string, enderecoData: CreateEnderecoFornecedorData): Promise<EnderecoFornecedor> {
		try {
			debugger;
			const response = await api.post<EnderecoFornecedor>(`/fornecedores/${fornecedorId}/enderecos`, enderecoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao criar endereço do fornecedor');
		}
	}

	/**
	 * Atualiza um endereço específico de um fornecedor
	 */
	async updateEndereco(fornecedorId: string, enderecoId: string, enderecoData: CreateEnderecoFornecedorData): Promise<EnderecoFornecedor> {
		try {
			const response = await api.put<EnderecoFornecedor>(`/fornecedores/${fornecedorId}/enderecos/${enderecoId}`, enderecoData);
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao atualizar endereço do fornecedor');
		}
	}

	/**
	 * Exclui um endereço específico de um fornecedor
	 */
	async deleteEndereco(fornecedorId: string, enderecoId: string): Promise<void> {
		try {
			await api.delete(`/fornecedores/${fornecedorId}/enderecos/${enderecoId}`);
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao excluir endereço do fornecedor');
		}
	}
}

export const enderecoFornecedorService = new EnderecoFornecedorService();
