// Tipos base para todas as entidades
export interface BaseEntity {
	id: string;
	created_at: string;
	updated_at: string;
}

// ===== AUTENTICAÇÃO =====
export interface LoginDto {
	cnpj: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	user: User;
}

export interface AlterarSenhaDto {
	senhaAtual: string;
	novaSenha: string;
}

// ===== USUÁRIOS =====
export interface User extends BaseEntity {
	nome: string;
	email: string;
	tipoUsuario: 'admin' | 'gerente' | 'vendedor' | 'caixa' | 'estoque';
	status: 'ativo' | 'inativo' | 'bloqueado';
	empresaId: string;
}

export interface CreateUsuarioDto {
	nome: string;
	email: string;
	senha: string;
	tipoUsuario?: 'admin' | 'gerente' | 'vendedor' | 'caixa' | 'estoque';
	status?: 'ativo' | 'inativo' | 'bloqueado';
}

export interface UpdateUsuarioDto {
	nome?: string;
	email?: string;
	senha?: string;
	tipoUsuario?: 'admin' | 'gerente' | 'vendedor' | 'caixa' | 'estoque';
	status?: 'ativo' | 'inativo' | 'bloqueado';
}

// ===== PARCEIROS =====
export interface Parceiro extends BaseEntity {
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	email?: string;
	telefone?: string;
	ativo: boolean;
}

export interface CreateParceiroDto {
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	email?: string;
	telefone?: string;
	ativo?: boolean;
}

export interface UpdateParceiroDto {
	razaoSocial?: string;
	nomeFantasia?: string;
	cnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	email?: string;
	telefone?: string;
	ativo?: boolean;
}

// ===== EMPRESAS =====
export interface Empresa extends BaseEntity {
	parceiroId: string;
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo: boolean;
}

export interface CreateEmpresaDto {
	parceiroId: string;
	razaoSocial: string;
	nomeFantasia?: string;
	cnpj: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo?: boolean;
}

export interface UpdateEmpresaDto {
	parceiroId?: string;
	razaoSocial?: string;
	nomeFantasia?: string;
	cnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo?: boolean;
}

// ===== CLIENTES =====
export interface Cliente extends BaseEntity {
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo: boolean;
}

export interface CreateClienteDto {
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo?: boolean;
}

export interface UpdateClienteDto {
	razaoSocial?: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	ativo?: boolean;
}

// ===== ENDEREÇOS DE CLIENTES =====
export interface ClienteEndereco extends BaseEntity {
	clienteId: string;
	empresaId: string;
	cep: string;
	logradouro: string;
	numero?: string;
	complemento?: string;
	municipio: string;
	municipioCodigo: string;
	bairro?: string;
	uf: string;
	ufCodigo: string;
	pais: string;
	paisCodigo: string;
	tipo: string[];
}

export interface CreateClienteEnderecoDto {
	cep: string;
	logradouro: string;
	numero?: string;
	complemento?: string;
	municipio: string;
	municipioCodigo: string;
	bairro?: string;
	uf: string;
	ufCodigo: string;
	pais?: string;
	paisCodigo?: string;
	tipo: string[];
}

export interface UpdateClienteEnderecoDto {
	cep?: string;
	logradouro?: string;
	numero?: string;
	complemento?: string;
	municipio?: string;
	municipioCodigo?: string;
	bairro?: string;
	uf?: string;
	ufCodigo?: string;
	pais?: string;
	paisCodigo?: string;
	tipo?: string[];
}

// ===== CONTATOS DE CLIENTES =====
export interface ClienteContato extends BaseEntity {
	clienteId: string;
	empresaId: string;
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

export interface CreateClienteContatoDto {
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

export interface UpdateClienteContatoDto {
	nome?: string;
	email?: string;
	telefone?: string;
	tipo?: string[];
}

// ===== FORNECEDORES =====
export interface Fornecedor extends BaseEntity {
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	tipoFornecimento: string[];
	ativo: boolean;
}

export interface CreateFornecedorDto {
	razaoSocial: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	tipoFornecimento: string[];
	ativo?: boolean;
}

export interface UpdateFornecedorDto {
	razaoSocial?: string;
	nomeFantasia?: string;
	cpfCnpj?: string;
	inscEstadual?: string;
	inscMunicipal?: string;
	tipoFornecimento?: string[];
	ativo?: boolean;
}

// ===== ENDEREÇOS DE FORNECEDORES =====
export interface FornecedorEndereco extends BaseEntity {
	fornecedorId: string;
	empresaId: string;
	cep: string;
	logradouro: string;
	numero?: string;
	complemento?: string;
	municipio: string;
	municipioCodigo?: string;
	bairro?: string;
	uf: string;
	ufCodigo?: string;
	pais?: string;
	paisCodigo?: string;
	tipo: string[];
}

export interface CreateFornecedorEnderecoDto {
	cep: string;
	logradouro: string;
	numero?: string;
	complemento?: string;
	municipio: string;
	municipioCodigo?: string;
	bairro?: string;
	uf: string;
	ufCodigo?: string;
	pais?: string;
	paisCodigo?: string;
	tipo: string[];
}

export interface UpdateFornecedorEnderecoDto {
	cep?: string;
	logradouro?: string;
	numero?: string;
	complemento?: string;
	municipio?: string;
	municipioCodigo?: string;
	bairro?: string;
	uf?: string;
	ufCodigo?: string;
	pais?: string;
	paisCodigo?: string;
	tipo?: string[];
}

// ===== CONTATOS DE FORNECEDORES =====
export interface FornecedorContato extends BaseEntity {
	fornecedorId: string;
	empresaId: string;
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

export interface CreateFornecedorContatoDto {
	nome: string;
	email?: string;
	telefone?: string;
	tipo: string[];
}

export interface UpdateFornecedorContatoDto {
	nome?: string;
	email?: string;
	telefone?: string;
	tipo?: string[];
}

// ===== TIPOS DE PRODUTOS =====
export interface TipoProduto extends BaseEntity {
	nome: string;
	descricao?: string;
	ativo: boolean;
}

export interface CreateTipoProdutoDto {
	nome: string;
	descricao?: string;
	ativo?: boolean;
}

export interface UpdateTipoProdutoDto {
	nome?: string;
	descricao?: string;
	ativo?: boolean;
}

// ===== MARCAS DE PRODUTOS =====
export interface MarcaProduto extends BaseEntity {
	nome: string;
	descricao?: string;
	ativo: boolean;
}

export interface CreateMarcaProdutoDto {
	nome: string;
	descricao?: string;
	ativo?: boolean;
}

export interface UpdateMarcaProdutoDto {
	nome?: string;
	descricao?: string;
	ativo?: boolean;
}

// ===== CATEGORIAS DE PRODUTOS =====
export interface CategoriaProduto extends BaseEntity {
	nome: string;
	descricao?: string;
	ativo: boolean;
}

export interface CreateCategoriaProdutoDto {
	nome: string;
	descricao?: string;
	ativo?: boolean;
}

export interface UpdateCategoriaProdutoDto {
	nome?: string;
	descricao?: string;
	ativo?: boolean;
}

// ===== PRODUTOS =====
export interface Produto extends BaseEntity {
	categoriaId?: string;
	nome: string;
	descricao?: string;
	ativo: boolean;
}

export interface CreateProdutoDto {
	categoriaId?: string;
	nome: string;
	descricao?: string;
	ativo?: boolean;
}

export interface UpdateProdutoDto {
	categoriaId?: string;
	nome?: string;
	descricao?: string;
	ativo?: boolean;
}

// ===== ESTOQUE =====
export interface Estoque extends BaseEntity {
	empresaId: string;
	produtoId: string;
	tipoProdutoId: string;
	estoqueTipoId: string;
	unidadeId: string;
	gradeId: string;
	codigoBarras?: string;
	sku?: string;
	precoCusto: number;
	qtdeInicial: number;
}

export interface CreateEstoqueDto {
	empresaId: string;
	produtoId: string;
	tipoProdutoId: string;
	estoqueTipoId: string;
	unidadeId: string;
	gradeId: string;
	codigoBarras?: string;
	sku?: string;
	precoCusto: number;
	qtdeInicial?: number;
}

export interface UpdateEstoqueDto {
	empresaId?: string;
	produtoId?: string;
	tipoProdutoId?: string;
	estoqueTipoId?: string;
	unidadeId?: string;
	gradeId?: string;
	codigoBarras?: string;
	sku?: string;
	precoCusto?: number;
	qtdeInicial?: number;
}

// ===== TIPOS DE ESTOQUE =====
export interface TipoEstoque extends BaseEntity {
	empresaId: string;
	nome: string;
	descricao?: string;
}

export interface CreateTipoEstoqueDto {
	nome: string;
	descricao?: string;
}

export interface UpdateTipoEstoqueDto {
	nome?: string;
	descricao?: string;
}

// ===== MOVIMENTOS DE ESTOQUE =====
export interface MovimentoEstoque extends BaseEntity {
	estoqueId: string;
	tipoMovimento: 'entrada' | 'saida';
	motivo: string;
	quantidade: number;
	referencia?: string;
}

export interface MovimentoEstoqueDto {
	estoqueId: string;
	tipoMovimento: 'entrada' | 'saida';
	motivo: string;
	quantidade: number;
	referencia?: string;
}

// ===== VENDAS =====
export interface Venda extends BaseEntity {
	empresaId: string;
	clienteId?: string;
	caixaId: string;
	total_bruto: number;
	desconto: number;
	total_liquido: number;
	status: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface CreateVendaDto {
	empresaId: string;
	clienteId?: string;
	caixaId: string;
	total_bruto: number;
	desconto?: number;
	total_liquido: number;
	status?: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface UpdateVendaDto {
	empresaId?: string;
	clienteId?: string;
	caixaId?: string;
	totalBruto?: number;
	desconto?: number;
	totalLiquido?: number;
	status?: 'Pendente' | 'Concluida' | 'Cancelada';
}

// ===== ESTATÍSTICAS =====
export interface EstatisticasCrescimentoClientes {
	total_atual: number;
	novos_este_mes: number;
	crescimentoPercentual: number;
	ativos: number;
	inativos: number;
	periodo: string;
}

// ===== HEALTH CHECK =====
export interface HealthCheck {
	status: string;
	timestamp: string;
	uptime: number;
	database: string;
	version: string;
}

export interface DetailedHealthCheck {
	status: string;
	timestamp: string;
	uptime: number;
	database: {
		status: string;
		responseTime: number;
	};
	memory: {
		used: number;
		free: number;
		total: number;
	};
	version: string;
	environment: string;
}

// ===== PERFIL =====
export interface Perfil {
	id: string;
	nome: string;
	email: string;
	usuarioTipo: string;
	empresaId: string;
}