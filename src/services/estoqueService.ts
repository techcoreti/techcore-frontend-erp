import api from './api';

// Tipos baseados no banco de dados
export interface Estoque {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresa_id: string;
	produto_id: string;
	estoque_tipo_id: string;
	sku?: string;
	codigo_barras?: string;
	preco_custo: number;
	quantidade_atual: number;
	quantidade_minima: number;
	quantidade_maxima: number;
}

export interface EstoqueCreate {
	produto_id: string;
	estoque_tipo_id: string;
	sku?: string;
	codigo_barras?: string;
	preco_custo: number;
	quantidade_atual: number;
	quantidade_minima: number;
	quantidade_maxima: number;
}

export interface EstoqueMovimento {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresa_id: string;
	estoque_id: string;
	tipo_movimento: 'entrada' | 'saida';
	motivo: string;
	quantidade: number;
	referencia?: string;
}

export interface EstoqueMovimentoCreate {
	estoque_id: string;
	tipo_movimento: 'entrada' | 'saida';
	motivo: string;
	quantidade: number;
	referencia?: string;
}

// Serviços de Estoque
export const estoqueService = {
	// Listar todos os estoques
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		const response = await api.get('/estoque', { params });
		return response;
	},

	// Buscar estoque por ID
	async getById(id: string) {
		const response = await api.get(`/estoque/${id}`);
		return response;
	},

	// Criar novo estoque
	async create(data: EstoqueCreate, empresaId: string) {
		const dataWithEmpresa = {
			...data,
			empresa_id: empresaId
		};
		const response = await api.post('/estoque', dataWithEmpresa);
		return response;
	},

	// Atualizar estoque
	async update(id: string, data: Partial<EstoqueCreate>) {
		const response = await api.put(`/estoque/${id}`, data);
		return response;
	},

	// Excluir estoque (soft delete)
	async delete(id: string) {
		const response = await api.delete(`/estoque/${id}`);
		return response;
	},

	// Restaurar estoque excluído
	async restore(id: string) {
		const response = await api.post(`/estoque/${id}/restore`);
		return response;
	}
};

// Serviços de Movimentações de Estoque
export const estoqueMovimentoService = {
	// Listar todas as movimentações
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		const response = await api.get('/estoques-movimentacoes', { params });
		return response;
	},

	// Buscar movimentação por ID
	async getById(id: string) {
		const response = await api.get(`/estoques-movimentacoes/${id}`);
		return response;
	},

	// Criar nova movimentação
	async create(data: EstoqueMovimentoCreate) {
		const response = await api.post('/estoques-movimentacoes', data);
		return response;
	},

	// Atualizar movimentação
	async update(id: string, data: Partial<EstoqueMovimentoCreate>) {
		const response = await api.put(`/estoques-movimentacoes/${id}`, data);
		return response;
	},

	// Excluir movimentação (soft delete)
	async delete(id: string) {
		const response = await api.delete(`/estoques-movimentacoes/${id}`);
		return response;
	}
};
