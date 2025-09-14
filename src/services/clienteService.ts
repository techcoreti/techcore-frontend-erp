import api from './api';

// Tipos baseados no banco de dados
export interface Cliente {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	nomeRazao: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	ativo: boolean;
}

export interface ClienteCreate {
	nomeRazao: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	ativo?: boolean;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {
	id: string;
}

// Serviços de Clientes
export const clienteService = {
	// Listar todos os clientes
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		return await api.get<Cliente[]>(`/clientes`, { params });
	},

	// Buscar cliente por ID
	async getById(id: string) {
		return await api.get<Cliente>(`/clientes/${id}`);
	},

	// Criar novo cliente
	async create(data: ClienteCreate) {
		// empresa_id é gerenciado pelo backend automaticamente
		return await api.post<Cliente>(`/clientes`, data);
	},

	// Atualizar cliente
	async update(id: string, data: Partial<ClienteCreate>) {
		return await api.put<Cliente>(`/clientes/${id}`, data);
	},

	// Excluir cliente (soft delete)
	async delete(id: string) {
		return await api.delete<void>(`/clientes/${id}`);
	},

	// Restaurar cliente excluído
	async restore(id: string) {
		return await api.post<void>(`/clientes/${id}/restore`);
	}
};
