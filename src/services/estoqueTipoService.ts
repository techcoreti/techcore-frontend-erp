import { EstoqueTipo } from '../types';
import api from './api';

// Tipos para criação e atualização
export interface EstoqueTipoCreate {
	nome: string;
	descricao?: string;
}

export interface EstoqueTipoUpdate {
	nome?: string;
	descricao?: string;
}

// Serviços para Tipos de Estoque
export const estoqueTipoService = {
	// Listar todos os tipos de estoque
	async getAll() {
		return await api.get<EstoqueTipo[]>('/estoques-tipos');
	},

	// Buscar tipo de estoque por ID
	async getById(id: string) {
		return await api.get<EstoqueTipo>(`/estoques-tipos/${id}`);
	},

	// Criar novo tipo de estoque
	async create(data: EstoqueTipoCreate) {
		return await api.post<EstoqueTipo>(`/estoques-tipos`, data);
	},

	// Atualizar tipo de estoque
	async update(id: string, data: EstoqueTipoUpdate) {
		return await api.put<EstoqueTipo>(`/estoques-tipos/${id}`, data);
	},

	// Excluir tipo de estoque (soft delete)
	async delete(id: string) {
		return await api.delete<void>(`/estoques-tipos/${id}`);
	},

	// Restaurar tipo de estoque excluído
	async restore(id: string) {
		return await api.post<void>(`/estoques-tipos/${id}/restore`);
	}
};
