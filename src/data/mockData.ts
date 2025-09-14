import {
	Cliente,
	Fornecedor,
	Produto,
	Estoque,
	Venda,
	VendaItem,
	DashboardStats,
	ChartData
} from '../types';

// Dados mockados de usuários para login
export const mockUsers = [
	{
		id: '1',
		username: 'admin',
		password: '123456',
		empresa_id: 'emp-1',
		empresa_nome: 'TechCore Solutions LTDA',
		empresa_cnpj: '12.345.678/0001-90',
		role: 'admin'
	},
	{
		id: '2',
		username: 'vendedor',
		password: '123456',
		empresa_id: 'emp-2',
		empresa_nome: 'Loja Moderna EIRELI',
		empresa_cnpj: '98.765.432/0001-10',
		role: 'vendedor'
	},
	{
		id: '3',
		username: 'gerente',
		password: '123456',
		empresa_id: 'emp-3',
		empresa_nome: 'Supermercado Central S/A',
		empresa_cnpj: '11.222.333/0001-44',
		role: 'gerente'
	}
];

// Dados mockados de clientes
export const mockClientes: Cliente[] = [
	{
		id: 'cli-1',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z',
		empresaId: 'emp-1',
		nomeRazao: 'João Silva',
		nomeFantasia: 'João Silva',
		cpfCnpj: '123.456.789-00',
		ativo: true
	},
	{
		id: 'cli-2',
		created_at: '2024-01-16T10:00:00Z',
		updated_at: '2024-01-16T10:00:00Z',
		empresaId: 'emp-1',
		nomeRazao: 'Maria Santos LTDA',
		nomeFantasia: 'Maria Santos',
		cpfCnpj: '12.345.678/0001-90',
		inscEstadual: '123456789',
		ativo: true
	},
	{
		id: 'cli-3',
		created_at: '2024-01-17T10:00:00Z',
		updated_at: '2024-01-17T10:00:00Z',
		empresaId: 'emp-1',
		nomeRazao: 'Pedro Oliveira',
		nomeFantasia: 'Pedro Oliveira',
		cpfCnpj: '987.654.321-00',
		ativo: true
	}
];

// Dados mockados de fornecedores
export const mockFornecedores: Fornecedor[] = [
	{
		id: 'forn-1',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z',
		empresaId: 'emp-1',
		razaoSocial: 'Fornecedor ABC LTDA',
		nomeFantasia: 'ABC Distribuidora',
		cpfCnpj: '12.345.678/0001-90',
		inscEstadual: '123456789',
		tipoFornecimento: ['venda'],
		ativo: true
	},
	{
		id: 'forn-2',
		created_at: '2024-01-16T10:00:00Z',
		updated_at: '2024-01-16T10:00:00Z',
		empresaId: 'emp-1',
		razaoSocial: 'Serviços XYZ S/A',
		nomeFantasia: 'XYZ Serviços',
		cpfCnpj: '98.765.432/0001-10',
		inscEstadual: '987654321',
		tipoFornecimento: ['servicos'],
		ativo: true
	}
];

// Dados mockados de produtos
export const mockProdutos: Produto[] = [
	{
		id: 'prod-1',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z',
		empresaId: 'emp-1',
		categoriaId: 'cat-1',
		nome: 'Smartphone Samsung Galaxy',
		descricao: 'Smartphone Samsung Galaxy S23, 128GB, Preto',
		ativo: true
	},
	{
		id: 'prod-2',
		created_at: '2024-01-16T10:00:00Z',
		updated_at: '2024-01-16T10:00:00Z',
		empresaId: 'emp-1',
		categoriaId: 'cat-2',
		nome: 'Notebook Dell Inspiron',
		descricao: 'Notebook Dell Inspiron 15, Intel i5, 8GB RAM, 256GB SSD',
		ativo: true
	},
	{
		id: 'prod-3',
		created_at: '2024-01-17T10:00:00Z',
		updated_at: '2024-01-17T10:00:00Z',
		empresaId: 'emp-1',
		categoriaId: 'cat-1',
		nome: 'Tablet iPad Air',
		descricao: 'Tablet iPad Air 5ª geração, 64GB, Cinza Espacial',
		ativo: true
	}
];

// Dados mockados de estoque
export const mockEstoque: Estoque[] = [
	{
		id: 'est-1',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z',
		empresaId: 'emp-1',
		produtoId: 'prod-1',
		tipoProdutoId: 'tipo-1',
		estoqueTipoId: 'est-tipo-1',
		unidadeId: 'unid-1',
		gradeItemId: 'grade-1',
		codigoBarras: '7891234567890',
		sku: 'SMG-S23-128-P',
		precoCusto: 2500.00,
		qtdeInicial: 10,
		qtdeEntrada: 5,
		qtdeSaida: 3,
		qtdeAtual: 12
	},
	{
		id: 'est-2',
		created_at: '2024-01-16T10:00:00Z',
		updated_at: '2024-01-16T10:00:00Z',
		empresaId: 'emp-1',
		produtoId: 'prod-2',
		tipoProdutoId: 'tipo-2',
		estoqueTipoId: 'est-tipo-1',
		unidadeId: 'unid-1',
		gradeItemId: 'grade-2',
		codigoBarras: '7891234567891',
		sku: 'DELL-INS-15-I5',
		precoCusto: 3500.00,
		qtdeInicial: 5,
		qtdeEntrada: 3,
		qtdeSaida: 1,
		qtdeAtual: 7
	}
];

// Dados mockados de vendas
export const mockVendas: Venda[] = [
	{
		id: 'venda-1',
		created_at: '2024-01-20T10:00:00Z',
		updated_at: '2024-01-20T10:00:00Z',
		empresaId: 'emp-1',
		clienteId: 'cli-1',
		caixaId: 'caixa-1',
		totalBruto: 3000.00,
		desconto: 100.00,
		totalLiquido: 2900.00,
		status: 'Concluida'
	},
	{
		id: 'venda-2',
		created_at: '2024-01-21T10:00:00Z',
		updated_at: '2024-01-21T10:00:00Z',
		empresaId: 'emp-1',
		clienteId: 'cli-2',
		caixaId: 'caixa-1',
		totalBruto: 1500.00,
		desconto: 0.00,
		totalLiquido: 1500.00,
		status: 'Pendente'
	}
];

// Dados mockados de itens de venda
export const mockVendaItens: VendaItem[] = [
	{
		id: 'item-1',
		created_at: '2024-01-20T10:00:00Z',
		updated_at: '2024-01-20T10:00:00Z',
		vendaId: 'venda-1',
		estoqueId: 'est-1',
		quantidade: 1,
		precoUnitario: 3000.00,
		desconto: 100.00,
		subtotal: 2900.00
	},
	{
		id: 'item-2',
		created_at: '2024-01-21T10:00:00Z',
		updated_at: '2024-01-21T10:00:00Z',
		vendaId: 'venda-2',
		estoqueId: 'est-2',
		quantidade: 1,
		precoUnitario: 1500.00,
		desconto: 0.00,
		subtotal: 1500.00
	}
];

// Dados mockados para dashboard
export const mockDashboardStats: DashboardStats = {
	totalVendas: 1250,
	totalClientes: 45,
	totalProdutos: 78,
	totalEstoque: 156,
	vendasHoje: 12,
	vendasMes: 89
};

// Dados mockados para gráficos
export const mockVendasChartData: ChartData[] = [
	{ name: 'Jan', value: 12000, color: '#3B82F6' },
	{ name: 'Fev', value: 15000, color: '#10B981' },
	{ name: 'Mar', value: 18000, color: '#F59E0B' },
	{ name: 'Abr', value: 16000, color: '#EF4444' },
	{ name: 'Mai', value: 20000, color: '#8B5CF6' },
	{ name: 'Jun', value: 22000, color: '#06B6D4' }
];

export const mockProdutosChartData: ChartData[] = [
	{ name: 'Smartphones', value: 45, color: '#3B82F6' },
	{ name: 'Notebooks', value: 30, color: '#10B981' },
	{ name: 'Tablets', value: 20, color: '#F59E0B' },
	{ name: 'Acessórios', value: 15, color: '#EF4444' }
];

// Dados mockados para gráfico de vendas por período (últimos 7 dias)
export const mockVendasPeriodoData: ChartData[] = [
	{ name: 'Seg', value: 2500, color: '#3B82F6' },
	{ name: 'Ter', value: 3200, color: '#10B981' },
	{ name: 'Qua', value: 1800, color: '#F59E0B' },
	{ name: 'Qui', value: 4100, color: '#EF4444' },
	{ name: 'Sex', value: 3800, color: '#8B5CF6' },
	{ name: 'Sáb', value: 2200, color: '#06B6D4' },
	{ name: 'Dom', value: 1500, color: '#84CC16' }
];

// Dados mockados para produtos em baixa
export const mockProdutosBaixaEstoque = [
	{
		id: 'prod-1',
		nome: 'Smartphone Samsung Galaxy',
		estoqueAtual: 2,
		estoqueMinimo: 5,
		categoria: 'Smartphones',
		preco: 2500.00
	},
	{
		id: 'prod-4',
		nome: 'Mouse Logitech MX Master',
		estoqueAtual: 1,
		estoqueMinimo: 10,
		categoria: 'Acessórios',
		preco: 350.00
	},
	{
		id: 'prod-5',
		nome: 'Teclado Mecânico Razer',
		estoqueAtual: 3,
		estoqueMinimo: 8,
		categoria: 'Acessórios',
		preco: 450.00
	},
	{
		id: 'prod-6',
		nome: 'Monitor LG 24"',
		estoqueAtual: 4,
		estoqueMinimo: 6,
		categoria: 'Monitores',
		preco: 800.00
	}
];
