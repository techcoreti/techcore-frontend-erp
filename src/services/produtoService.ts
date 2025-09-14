import api from './api';

// Tipos baseados no banco de dados
export interface Produto {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresa_id: string;
	categoria_id: string;
	tipo_produto_id: string;
	nome: string;
	descricao?: string;
	sku?: string;
	codigo_barras?: string;
	preco_custo: number;
	preco_venda: number;
	ativo: boolean;
}

export interface ProdutoCreate {
	categoria_id: string;
	tipo_produto_id: string;
	nome: string;
	descricao?: string;
	sku?: string;
	codigo_barras?: string;
	preco_custo: number;
	preco_venda: number;
	ativo?: boolean;
}

// Serviços de Produtos
export const produtoService = {
	// Listar todos os produtos
	async getAll(params?: { page?: number; limit?: number; search?: string }) {
		const response = await api.get('/produtos', { params });
		return response;
	},

	// Buscar produto por ID
	async getById(id: string) {
		const response = await api.get(`/produtos/${id}`);
		return response;
	},

	// Criar novo produto
	async create(data: ProdutoCreate, empresaId: string) {
		const dataWithEmpresa = {
			...data,
			empresa_id: empresaId
		};
		const response = await api.post('/produtos', dataWithEmpresa);
		return response;
	},

	// Atualizar produto
	async update(id: string, data: Partial<ProdutoCreate>) {
		const response = await api.put(`/produtos/${id}`, data);
		return response;
	},

	// Excluir produto (soft delete)
	async delete(id: string) {
		const response = await api.delete(`/produtos/${id}`);
		return response;
	},

	// Restaurar produto excluído
	async restore(id: string) {
		const response = await api.post(`/produtos/${id}/restore`);
		return response;
	}
};
