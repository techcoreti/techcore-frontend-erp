// Tipos baseados na estrutura do banco de dados SQL

export interface Parceiro {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	email?: string;
	telefone?: string;
	ativo: boolean;
}

export interface Empresa {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	parceiroId: string;
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo: boolean;
}

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
	inscMunicipal?: string;
	ativo: boolean;
}

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
	inscMunicipal?: string;
	tipoFornecimento: TipoFornecimento[];
	ativo: boolean;
}

export interface Produto {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	categoriaId?: string;
	nome: string;
	descricao?: string;
	ativo: boolean;
}

export interface TipoPagamento {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	codigo: string;
	nome: string;
}

export interface EstoqueTipo {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	nome: string;
	descricao?: string;
}

export interface Estoque {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	produtoId: string;
	tipoProdutoId: string;
	estoqueTipoId: string;
	unidadeId: string;
	gradeItemId: string;
	codigoBarras?: string;
	sku?: string;
	precoCusto: number;
	qtdeInicial: number;
	qtdeEntrada: number;
	qtdeSaida: number;
	qtdeAtual: number;
}

export interface Venda {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	empresaId: string;
	clienteId?: string;
	caixaId: string;
	totalBruto: number;
	desconto: number;
	totalLiquido: number;
	status: StatusVenda;
}

export interface VendaItem {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	vendaId: string;
	estoqueId: string;
	quantidade: number;
	precoUnitario: number;
	desconto: number;
	subtotal: number;
}

// Enums
export type TipoEndereco = 'comercial' | 'financeiro' | 'administrativo';
export type TipoContato = 'comercial' | 'financeiro' | 'administrativo';
export type TipoFornecimento = 'venda' | 'servicos' | 'ambos';
export type TipoGrade = 'cor' | 'tamanho' | 'tipo';
export type TipoMovimentoEstoque = 'entrada' | 'saida';
export type StatusVenda = 'Pendente' | 'Concluida' | 'Cancelada';
export type TipoDestino = 'PDV' | 'Retaguarda';

// Tipos para autenticação
export interface LoginData {
	cnpj: string;
	email: string;
	password: string;
}

export interface User {
	id: string;
	nome: string;
	email: string;
	tipoUsuario: string;
	empresaId: string;
}

export interface AuthContextType {
	user: User | null;
	login: (data: LoginData) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

// Tipos para navegação
export interface MenuItem {
	id: string;
	label: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	path: string;
	children?: MenuItem[];
}

// Tipos para formulários
export interface FormField {
	name: string;
	label: string;
	type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date';
	required?: boolean;
	options?: { value: string; label: string }[];
	placeholder?: string;
}

// Tipos para tabelas
export interface TableColumn<T = Record<string, unknown>> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: unknown, record: T) => React.ReactNode;
}

export interface PaginationData {
	current: number;
	pageSize: number;
	total: number;
}

// Tipos para relatórios
export interface ChartData {
	name: string;
	value: number;
	color?: string;
}

export interface DashboardStats {
	totalVendas: number;
	totalClientes: number;
	totalProdutos: number;
	totalEstoque: number;
	vendasHoje: number;
	vendasMes: number;
}
