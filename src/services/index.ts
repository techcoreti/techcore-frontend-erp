import apiService from './api';
import {
	// Autenticação
	LoginDto,
	LoginResponse,
	AlterarSenhaDto,
	Perfil,

	// Usuários
	User,
	CreateUsuarioDto,
	UpdateUsuarioDto,

	// Parceiros
	Parceiro,
	CreateParceiroDto,
	UpdateParceiroDto,

	// Empresas
	Empresa,
	CreateEmpresaDto,
	UpdateEmpresaDto,

	// Clientes
	Cliente,
	CreateClienteDto,
	UpdateClienteDto,
	ClienteEndereco,
	CreateClienteEnderecoDto,
	UpdateClienteEnderecoDto,
	ClienteContato,
	CreateClienteContatoDto,
	UpdateClienteContatoDto,
	EstatisticasCrescimentoClientes,

	// Fornecedores
	Fornecedor,
	CreateFornecedorDto,
	UpdateFornecedorDto,
	FornecedorEndereco,
	CreateFornecedorEnderecoDto,
	UpdateFornecedorEnderecoDto,
	FornecedorContato,
	CreateFornecedorContatoDto,
	UpdateFornecedorContatoDto,

	// Tipos de Produtos
	TipoProduto,
	CreateTipoProdutoDto,
	UpdateTipoProdutoDto,

	// Marcas de Produtos
	MarcaProduto,
	CreateMarcaProdutoDto,
	UpdateMarcaProdutoDto,

	// Categorias de Produtos
	CategoriaProduto,
	CreateCategoriaProdutoDto,
	UpdateCategoriaProdutoDto,

	// Produtos
	Produto,
	CreateProdutoDto,
	UpdateProdutoDto,

	// Estoque
	Estoque,
	CreateEstoqueDto,
	UpdateEstoqueDto,
	MovimentoEstoque,
	MovimentoEstoqueDto,

	// Tipos de Estoque
	TipoEstoque,
	CreateTipoEstoqueDto,
	UpdateTipoEstoqueDto,

	// Vendas
	Venda,
	CreateVendaDto,
	UpdateVendaDto,

	// Health Check
	HealthCheck,
	DetailedHealthCheck,
} from '../types/api';

// ===== SERVIÇO DE AUTENTICAÇÃO =====
export class AuthService {
	async login(credentials: LoginDto): Promise<LoginResponse> {
		return apiService.post<LoginResponse>('/auth/login', credentials);
	}

	async getProfile(): Promise<Perfil> {
		return apiService.get<Perfil>('/perfil');
	}
}

// ===== SERVIÇO DE USUÁRIOS =====
export class UsuarioService {
	async findAll(): Promise<User[]> {
		return apiService.get<User[]>('/usuarios');
	}

	async findById(id: string): Promise<User> {
		return apiService.get<User>(`/usuarios/${id}`);
	}

	async findByEmail(email: string): Promise<User> {
		return apiService.get<User>(`/usuarios/email/${email}`);
	}

	async findByTipoUsuario(tipoUsuario: string): Promise<User[]> {
		return apiService.get<User[]>(`/usuarios/tipo/${tipoUsuario}`);
	}

	async findByStatus(status: string): Promise<User[]> {
		return apiService.get<User[]>(`/usuarios/status/${status}`);
	}

	async create(data: CreateUsuarioDto): Promise<User> {
		return apiService.post<User>('/usuarios', data);
	}

	async update(id: string, data: UpdateUsuarioDto): Promise<User> {
		return apiService.put<User>(`/usuarios/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/usuarios/${id}`);
	}

	async alterarSenha(id: string, data: AlterarSenhaDto): Promise<void> {
		return apiService.patch<void>(`/usuarios/${id}/alterar-senha`, data);
	}

	async bloquearUsuario(id: string): Promise<void> {
		return apiService.patch<void>(`/usuarios/${id}/bloquear`);
	}

	async desbloquearUsuario(id: string): Promise<void> {
		return apiService.patch<void>(`/usuarios/${id}/desbloquear`);
	}
}

// ===== SERVIÇO DE PARCEIROS =====
export class ParceiroService {
	async findAll(): Promise<Parceiro[]> {
		return apiService.get<Parceiro[]>('/parceiros');
	}

	async findById(id: string): Promise<Parceiro> {
		return apiService.get<Parceiro>(`/parceiros/${id}`);
	}

	async findByCnpj(cnpj: string): Promise<Parceiro> {
		return apiService.get<Parceiro>(`/parceiros/cnpj/${cnpj}`);
	}

	async create(data: CreateParceiroDto): Promise<Parceiro> {
		return apiService.post<Parceiro>('/parceiros', data);
	}

	async update(id: string, data: UpdateParceiroDto): Promise<Parceiro> {
		return apiService.put<Parceiro>(`/parceiros/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/parceiros/${id}`);
	}
}

// ===== SERVIÇO DE EMPRESAS =====
export class EmpresaService {
	async findAll(): Promise<Empresa[]> {
		return apiService.get<Empresa[]>('/empresas');
	}

	async findById(id: string): Promise<Empresa> {
		return apiService.get<Empresa>(`/empresas/${id}`);
	}

	async findByCnpj(cnpj: string): Promise<Empresa> {
		return apiService.get<Empresa>(`/empresas/cnpj/${cnpj}`);
	}

	async findByParceiroId(parceiroId: string): Promise<Empresa[]> {
		return apiService.get<Empresa[]>(`/empresas/parceiro/${parceiroId}`);
	}

	async create(data: CreateEmpresaDto): Promise<Empresa> {
		return apiService.post<Empresa>('/empresas', data);
	}

	async update(id: string, data: UpdateEmpresaDto): Promise<Empresa> {
		return apiService.put<Empresa>(`/empresas/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/empresas/${id}`);
	}
}

// ===== SERVIÇO DE CLIENTES =====
export class ClienteService {
	async findAll(): Promise<Cliente[]> {
		return apiService.get<Cliente[]>('/clientes');
	}

	async findById(id: string): Promise<Cliente> {
		return apiService.get<Cliente>(`/clientes/${id}`);
	}

	async findByCpfCnpj(cpfCnpj: string): Promise<Cliente> {
		return apiService.get<Cliente>(`/clientes/cpf-cnpj/${cpfCnpj}`);
	}

	async getEstatisticasCrescimento(): Promise<EstatisticasCrescimentoClientes> {
		return apiService.get<EstatisticasCrescimentoClientes>('/clientes/estatisticas/crescimento');
	}

	async create(data: CreateClienteDto): Promise<Cliente> {
		return apiService.post<Cliente>('/clientes', data);
	}

	async update(id: string, data: UpdateClienteDto): Promise<Cliente> {
		return apiService.put<Cliente>(`/clientes/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/clientes/${id}`);
	}

	// Endereços de clientes
	async getEnderecosCliente(clienteId: string): Promise<ClienteEndereco[]> {
		return apiService.get<ClienteEndereco[]>(`/clientes/${clienteId}/enderecos`);
	}

	async createEnderecoCliente(clienteId: string, data: CreateClienteEnderecoDto): Promise<ClienteEndereco> {
		return apiService.post<ClienteEndereco>(`/clientes/${clienteId}/enderecos`, data);
	}

	async updateEnderecoCliente(clienteId: string, enderecoId: string, data: UpdateClienteEnderecoDto): Promise<ClienteEndereco> {
		return apiService.put<ClienteEndereco>(`/clientes/${clienteId}/enderecos/${enderecoId}`, data);
	}

	async deleteEnderecoCliente(clienteId: string, enderecoId: string): Promise<void> {
		return apiService.delete<void>(`/clientes/${clienteId}/enderecos/${enderecoId}`);
	}

	// Contatos de clientes
	async getContatosCliente(clienteId: string): Promise<ClienteContato[]> {
		return apiService.get<ClienteContato[]>(`/clientes/${clienteId}/contatos`);
	}

	async createContatoCliente(clienteId: string, data: CreateClienteContatoDto): Promise<ClienteContato> {
		return apiService.post<ClienteContato>(`/clientes/${clienteId}/contatos`, data);
	}

	async updateContatoCliente(clienteId: string, contatoId: string, data: UpdateClienteContatoDto): Promise<ClienteContato> {
		return apiService.put<ClienteContato>(`/clientes/${clienteId}/contatos/${contatoId}`, data);
	}

	async deleteContatoCliente(clienteId: string, contatoId: string): Promise<void> {
		return apiService.delete<void>(`/clientes/${clienteId}/contatos/${contatoId}`);
	}
}

// ===== SERVIÇO DE FORNECEDORES =====
export class FornecedorService {
	async findAll(): Promise<Fornecedor[]> {
		return apiService.get<Fornecedor[]>('/fornecedores');
	}

	async findById(id: string): Promise<Fornecedor> {
		return apiService.get<Fornecedor>(`/fornecedores/${id}`);
	}

	async findByEmpresaId(empresaId: string): Promise<Fornecedor[]> {
		return apiService.get<Fornecedor[]>(`/fornecedores/empresa/${empresaId}`);
	}

	async findByCpfCnpj(cpfCnpj: string): Promise<Fornecedor> {
		return apiService.get<Fornecedor>(`/fornecedores/cpf-cnpj/${cpfCnpj}`);
	}

	async create(data: CreateFornecedorDto): Promise<Fornecedor> {
		return apiService.post<Fornecedor>('/fornecedores', data);
	}

	async update(id: string, data: UpdateFornecedorDto): Promise<Fornecedor> {
		return apiService.put<Fornecedor>(`/fornecedores/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/fornecedores/${id}`);
	}

	// Endereços de fornecedores
	async getEnderecosFornecedor(fornecedorId: string): Promise<FornecedorEndereco[]> {
		return apiService.get<FornecedorEndereco[]>(`/fornecedores/${fornecedorId}/enderecos`);
	}

	async createEnderecoFornecedor(fornecedorId: string, data: CreateFornecedorEnderecoDto): Promise<FornecedorEndereco> {
		return apiService.post<FornecedorEndereco>(`/fornecedores/${fornecedorId}/enderecos`, data);
	}

	async updateEnderecoFornecedor(fornecedorId: string, enderecoId: string, data: UpdateFornecedorEnderecoDto): Promise<FornecedorEndereco> {
		return apiService.put<FornecedorEndereco>(`/fornecedores/${fornecedorId}/enderecos/${enderecoId}`, data);
	}

	async deleteEnderecoFornecedor(fornecedorId: string, enderecoId: string): Promise<void> {
		return apiService.delete<void>(`/fornecedores/${fornecedorId}/enderecos/${enderecoId}`);
	}

	// Contatos de fornecedores
	async getContatosFornecedor(fornecedorId: string): Promise<FornecedorContato[]> {
		return apiService.get<FornecedorContato[]>(`/fornecedores/${fornecedorId}/contatos`);
	}

	async createContatoFornecedor(fornecedorId: string, data: CreateFornecedorContatoDto): Promise<FornecedorContato> {
		return apiService.post<FornecedorContato>(`/fornecedores/${fornecedorId}/contatos`, data);
	}

	async updateContatoFornecedor(fornecedorId: string, contatoId: string, data: UpdateFornecedorContatoDto): Promise<FornecedorContato> {
		return apiService.put<FornecedorContato>(`/fornecedores/${fornecedorId}/contatos/${contatoId}`, data);
	}

	async deleteContatoFornecedor(fornecedorId: string, contatoId: string): Promise<void> {
		return apiService.delete<void>(`/fornecedores/${fornecedorId}/contatos/${contatoId}`);
	}
}

// ===== SERVIÇO DE TIPOS DE PRODUTOS =====
export class TipoProdutoService {
	async findAll(): Promise<TipoProduto[]> {
		return apiService.get<TipoProduto[]>('/produtos-tipos');
	}

	async findById(id: string): Promise<TipoProduto> {
		return apiService.get<TipoProduto>(`/produtos-tipos/${id}`);
	}

	async create(data: CreateTipoProdutoDto): Promise<TipoProduto> {
		return apiService.post<TipoProduto>('/produtos-tipos', data);
	}

	async update(id: string, data: UpdateTipoProdutoDto): Promise<TipoProduto> {
		return apiService.put<TipoProduto>(`/produtos-tipos/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/produtos-tipos/${id}`);
	}
}

// ===== SERVIÇO DE MARCAS DE PRODUTOS =====
export class MarcaProdutoService {
	async findAll(): Promise<MarcaProduto[]> {
		return apiService.get<MarcaProduto[]>('/produtos-marcas');
	}

	async findById(id: string): Promise<MarcaProduto> {
		return apiService.get<MarcaProduto>(`/produtos-marcas/${id}`);
	}

	async create(data: CreateMarcaProdutoDto): Promise<MarcaProduto> {
		return apiService.post<MarcaProduto>('/produtos-marcas', data);
	}

	async update(id: string, data: UpdateMarcaProdutoDto): Promise<MarcaProduto> {
		return apiService.put<MarcaProduto>(`/produtos-marcas/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/produtos-marcas/${id}`);
	}
}

// ===== SERVIÇO DE CATEGORIAS DE PRODUTOS =====
export class CategoriaProdutoService {
	async findAll(): Promise<CategoriaProduto[]> {
		return apiService.get<CategoriaProduto[]>('/produtos-categorias');
	}

	async findById(id: string): Promise<CategoriaProduto> {
		return apiService.get<CategoriaProduto>(`/produtos-categorias/${id}`);
	}

	async create(data: CreateCategoriaProdutoDto): Promise<CategoriaProduto> {
		return apiService.post<CategoriaProduto>('/produtos-categorias', data);
	}

	async update(id: string, data: UpdateCategoriaProdutoDto): Promise<CategoriaProduto> {
		return apiService.put<CategoriaProduto>(`/produtos-categorias/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/produtos-categorias/${id}`);
	}
}

// ===== SERVIÇO DE PRODUTOS =====
export class ProdutoService {
	async findAll(): Promise<Produto[]> {
		return apiService.get<Produto[]>('/produtos');
	}

	async findById(id: string): Promise<Produto> {
		return apiService.get<Produto>(`/produtos/${id}`);
	}

	async findByCategoriaId(categoriaId: string): Promise<Produto[]> {
		return apiService.get<Produto[]>(`/produtos/categoria/${categoriaId}`);
	}

	async create(data: CreateProdutoDto): Promise<Produto> {
		return apiService.post<Produto>('/produtos', data);
	}

	async update(id: string, data: UpdateProdutoDto): Promise<Produto> {
		return apiService.put<Produto>(`/produtos/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/produtos/${id}`);
	}
}

// ===== SERVIÇO DE ESTOQUE =====
export class EstoqueService {
	async findAll(): Promise<Estoque[]> {
		return apiService.get<Estoque[]>('/estoque');
	}

	async findById(id: string): Promise<Estoque> {
		return apiService.get<Estoque>(`/estoque/${id}`);
	}

	async findByEmpresaId(empresaId: string): Promise<Estoque[]> {
		return apiService.get<Estoque[]>(`/estoque/empresa/${empresaId}`);
	}

	async findByProdutoId(produtoId: string): Promise<Estoque[]> {
		return apiService.get<Estoque[]>(`/estoque/produto/${produtoId}`);
	}

	async findByCodigoBarras(codigoBarras: string): Promise<Estoque> {
		return apiService.get<Estoque>(`/estoque/codigo-barras/${codigoBarras}`);
	}

	async findBySku(sku: string): Promise<Estoque> {
		return apiService.get<Estoque>(`/estoque/sku/${sku}`);
	}

	async create(data: CreateEstoqueDto): Promise<Estoque> {
		return apiService.post<Estoque>('/estoque', data);
	}

	async update(id: string, data: UpdateEstoqueDto): Promise<Estoque> {
		return apiService.put<Estoque>(`/estoque/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/estoque/${id}`);
	}

	async registrarMovimento(estoqueId: string, data: MovimentoEstoqueDto): Promise<void> {
		return apiService.post<void>(`/estoque/${estoqueId}/movimento`, data);
	}
}

// ===== SERVIÇO DE TIPOS DE ESTOQUE =====
export class TipoEstoqueService {
	async findAll(): Promise<TipoEstoque[]> {
		return apiService.get<TipoEstoque[]>('/estoques-tipos');
	}

	async create(data: CreateTipoEstoqueDto): Promise<TipoEstoque> {
		return apiService.post<TipoEstoque>('/estoques-tipos', data);
	}

	async update(id: string, data: UpdateTipoEstoqueDto): Promise<TipoEstoque> {
		return apiService.put<TipoEstoque>(`/estoques-tipos/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/estoques-tipos/${id}`);
	}
}

// ===== SERVIÇO DE MOVIMENTOS DE ESTOQUE =====
export class MovimentoEstoqueService {
	async findAll(estoqueId?: string): Promise<MovimentoEstoque[]> {
		const params = estoqueId ? { estoqueId } : undefined;
		return apiService.get<MovimentoEstoque[]>('/estoque-movimentos', params);
	}

	async findById(id: string): Promise<MovimentoEstoque> {
		return apiService.get<MovimentoEstoque>(`/estoque-movimentos/${id}`);
	}

	async findByEstoqueId(estoqueId: string): Promise<MovimentoEstoque[]> {
		return apiService.get<MovimentoEstoque[]>(`/estoque-movimentos/estoque/${estoqueId}`);
	}

	async create(data: MovimentoEstoqueDto): Promise<MovimentoEstoque> {
		return apiService.post<MovimentoEstoque>('/estoque-movimentos', data);
	}

	async update(id: string, data: MovimentoEstoqueDto): Promise<MovimentoEstoque> {
		return apiService.put<MovimentoEstoque>(`/estoque-movimentos/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/estoque-movimentos/${id}`);
	}
}

// ===== SERVIÇO DE VENDAS =====
export class VendaService {
	async findAll(): Promise<Venda[]> {
		return apiService.get<Venda[]>('/vendas');
	}

	async findById(id: string): Promise<Venda> {
		return apiService.get<Venda>(`/vendas/${id}`);
	}

	async findByClienteId(clienteId: string): Promise<Venda[]> {
		return apiService.get<Venda[]>(`/vendas/cliente/${clienteId}`);
	}

	async findByCaixaId(caixaId: string): Promise<Venda[]> {
		return apiService.get<Venda[]>(`/vendas/caixa/${caixaId}`);
	}

	async findByStatus(status: string): Promise<Venda[]> {
		return apiService.get<Venda[]>(`/vendas/status/${status}`);
	}

	async create(data: CreateVendaDto): Promise<Venda> {
		return apiService.post<Venda>('/vendas', data);
	}

	async update(id: string, data: UpdateVendaDto): Promise<Venda> {
		return apiService.put<Venda>(`/vendas/${id}`, data);
	}

	async delete(id: string): Promise<void> {
		return apiService.delete<void>(`/vendas/${id}`);
	}

	async concluirVenda(id: string): Promise<void> {
		return apiService.patch<void>(`/vendas/${id}/concluir`);
	}

	async cancelarVenda(id: string): Promise<void> {
		return apiService.patch<void>(`/vendas/${id}/cancelar`);
	}
}

// ===== SERVIÇO DE HEALTH CHECK =====
export class HealthService {
	async check(): Promise<HealthCheck> {
		return apiService.get<HealthCheck>('/health');
	}

	async detailedCheck(): Promise<DetailedHealthCheck> {
		return apiService.get<DetailedHealthCheck>('/health/detailed');
	}
}

// Instâncias dos serviços
export const authService = new AuthService();
export const usuarioService = new UsuarioService();
export const parceiroService = new ParceiroService();
export const empresaService = new EmpresaService();
export const clienteService = new ClienteService();
export const fornecedorService = new FornecedorService();
export const tipoProdutoService = new TipoProdutoService();
export const marcaProdutoService = new MarcaProdutoService();
export const categoriaProdutoService = new CategoriaProdutoService();
export const produtoService = new ProdutoService();
export const estoqueService = new EstoqueService();
export const tipoEstoqueService = new TipoEstoqueService();
export const movimentoEstoqueService = new MovimentoEstoqueService();
export const vendaService = new VendaService();
export const healthService = new HealthService();
