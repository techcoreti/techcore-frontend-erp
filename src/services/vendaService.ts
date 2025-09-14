import api from './api';

// Tipos baseados no banco de dados
export interface Venda {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresa_id: string;
	cliente_id?: string;
	caixa_id: string;
	total_bruto: number;
	desconto: number;
	total_liquido: number;
	status: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface VendaCreate {
	cliente_id?: string;
	caixa_id: string;
	total_bruto: number;
	desconto?: number;
	total_liquido: number;
	status?: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface VendaItem {
	id: string;
	venda_id: string;
	produto_id: string;
	grade_item_id: string;
	quantidade: number;
	preco_unitario: number;
	desconto: number;
	total_item: number;
}

export interface VendaItemCreate {
	produto_id: string;
	grade_item_id: string;
	quantidade: number;
	preco_unitario: number;
	desconto?: number;
	total_item: number;
}

// Serviços de Vendas
export const vendaService = {
	// Listar todas as vendas
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		const response = await api.get<Venda[]>('/vendas', { params });
		return response;
	},

	// Buscar venda por ID
	async getById(id: string): Promise<Venda> {
		const response = await api.get<Venda>(`/vendas/${id}`);
		return response
	},

	// Criar nova venda
	async create(data: VendaCreate, empresaId: string) {
		const dataWithEmpresa = {
			...data,
			empresa_id: empresaId
		};
		const response = await api.post<Venda>('/vendas', dataWithEmpresa);
		return response;
	},

	// Atualizar venda
	async update(id: string, data: Partial<VendaCreate>): Promise<Venda> {
		const response = await api.put<Venda>(`/vendas/${id}`, data);
		return response
	},


};

// Serviços de Itens de Venda
export const vendaItemService = {
	// Listar itens de uma venda
	async getByVendaId(vendaId: string): Promise<VendaItem[]> {
		const response = await api.get<VendaItem[]>(`/vendas/${vendaId}/itens`);
		return response;
	},

	// Adicionar item à venda
	async create(vendaId: string, data: VendaItemCreate): Promise<VendaItem> {
		const response = await api.post<VendaItem>(`/vendas/${vendaId}/itens`, data);
		return response;
	},

	// Atualizar item da venda
	async update(vendaId: string, itemId: string, data: Partial<VendaItemCreate>): Promise<VendaItem> {
		const response = await api.put<VendaItem>(`/vendas/${vendaId}/itens/${itemId}`, data);
		return response;
	},

	// Remover item da venda
	async delete(vendaId: string, itemId: string): Promise<void> {
		await api.delete(`/vendas/${vendaId}/itens/${itemId}`);
	}
};
