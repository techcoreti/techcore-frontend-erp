import api from './api';

// Tipos baseados no banco de dados
export interface Fornecedor {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	tipoFornecimento: string[];
	ativo: boolean;
}

export interface FornecedorCreate {
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	tipoFornecimento?: string[];
	ativo?: boolean;
}

// Serviços de Fornecedores
export const fornecedorService = {
	// Listar todos os fornecedores
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		return await api.get<Fornecedor[]>(`/fornecedores`, { params });
	},

	// Buscar fornecedor por ID
	async getById(id: string) {
		return await api.get<Fornecedor>(`/fornecedores/${id}`);
	},

	// Criar novo fornecedor
	async create(data: FornecedorCreate) {
		// empresa_id é gerenciado pelo backend automaticamente
		return await api.post<Fornecedor>(`/fornecedores`, data);
	},

	// Atualizar fornecedor
	async update(id: string, data: Partial<FornecedorCreate>) {
		return await api.put<Fornecedor>(`/fornecedores/${id}`, data);
	},

	// Excluir fornecedor (soft delete)
	async delete(id: string) {
		return await api.delete<void>(`/fornecedores/${id}`);
	},

	// Restaurar fornecedor excluído
	async restore(id: string) {
		return await api.post<void>(`/fornecedores/${id}/restore`);
	}
};
