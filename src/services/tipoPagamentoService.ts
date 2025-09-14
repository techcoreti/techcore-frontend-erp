import api from './api';

// Tipos baseados na tabela tipos_pagamentos do banco de dados
export interface TipoPagamento {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	codigo: string;
	nome: string;
}

export interface TipoPagamentoCreate {
	codigo: string;
	nome: string;
}

export interface TipoPagamentoUpdate {
	codigo?: string;
	nome?: string;
}

// Serviços para Tipos de Pagamento
export const tipoPagamentoService = {
	async getAll() {
		return await api.get<TipoPagamento[]>('/tipos-pagamentos');
	},

	// Buscar tipo de pagamento por ID
	async getById(id: string) {
		return await api.get<TipoPagamento>(`/tipos-pagamentos/${id}`);
	},

	// Criar novo tipo de pagamento
	async create(data: TipoPagamentoCreate) {
		return await api.post<TipoPagamento>(`/tipos-pagamentos`, data);
	},

	// Atualizar tipo de pagamento
	async update(id: string, data: TipoPagamentoUpdate) {
		return await api.put<TipoPagamento>(`/tipos-pagamentos/${id}`, data);
	},

	// Excluir tipo de pagamento (soft delete)
	async delete(id: string) {
		return await api.delete<void>(`/tipos-pagamentos/${id}`);
	},

	// Restaurar tipo de pagamento excluído
	async restore(id: string) {
		return await api.post<void>(`/tipos-pagamentos/${id}/restore`);
	}
};
