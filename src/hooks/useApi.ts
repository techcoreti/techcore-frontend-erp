import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
	authService,
	usuarioService,
	clienteService,
	fornecedorService,
	tipoProdutoService,
	marcaProdutoService,
	categoriaProdutoService,
	produtoService,
	estoqueService,
	vendaService,
	healthService,
} from '../services';
import {
	LoginDto,
	User,
	CreateUsuarioDto,
	UpdateUsuarioDto,
	Cliente,
	CreateClienteDto,
	UpdateClienteDto,
	Fornecedor,
	CreateFornecedorDto,
	UpdateFornecedorDto,
	TipoProduto,
	CreateTipoProdutoDto,
	UpdateTipoProdutoDto,
	MarcaProduto,
	CreateMarcaProdutoDto,
	UpdateMarcaProdutoDto,
	CategoriaProduto,
	CreateCategoriaProdutoDto,
	UpdateCategoriaProdutoDto,
	Produto,
	CreateProdutoDto,
	UpdateProdutoDto,
	Estoque,
	CreateEstoqueDto,
	UpdateEstoqueDto,
	MovimentoEstoqueDto,
	Venda,
	CreateVendaDto,
	UpdateVendaDto,
	EstatisticasCrescimentoClientes,
	HealthCheck,
} from '../types/api';
import apiService from '../services/api';

// Hook para autenticação
export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = useCallback(async (credentials: LoginDto) => {
		setLoading(true);
		setError(null);
		try {
			const response = await authService.login(credentials);
			localStorage.setItem('token', response.accessToken);
			localStorage.setItem('user', JSON.stringify(response.user));
			setUser(response.user);
			apiService.setAuthToken(response.accessToken);
			toast.success('Login realizado com sucesso!');
			return response;
		} catch (err: any) {
			setError(err.message);
			toast.error('Erro ao fazer login');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		apiService.removeAuthToken();
		toast.success('Logout realizado com sucesso!');
	}, []);

	const getProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const profile = await authService.getProfile();
			setUser(profile as unknown as User);
			return profile;
		} catch (err: any) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Verificar se há token no localStorage ao inicializar
	useEffect(() => {
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		if (token && userData) {
			try {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
				apiService.setAuthToken(token);
			} catch (err) {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		}
	}, []);

	return {
		user,
		loading,
		error,
		login,
		logout,
		getProfile,
		isAuthenticated: !!user,
	};
};

// Hook para usuários
export const useUsuarios = () => {
	const [usuarios, setUsuarios] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUsuarios = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await usuarioService.findAll();
			setUsuarios(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createUsuario = useCallback(async (data: CreateUsuarioDto) => {
		try {
			const newUsuario = await usuarioService.create(data);
			setUsuarios(prev => [...prev, newUsuario]);
			toast.success('Usuário criado com sucesso!');
			return newUsuario;
		} catch (err: any) {
			toast.error('Erro ao criar usuário');
			throw err;
		}
	}, []);

	const updateUsuario = useCallback(async (id: string, data: UpdateUsuarioDto) => {
		try {
			const updatedUsuario = await usuarioService.update(id, data);
			setUsuarios(prev => prev.map(u => u.id === id ? updatedUsuario : u));
			toast.success('Usuário atualizado com sucesso!');
			return updatedUsuario;
		} catch (err: any) {
			toast.error('Erro ao atualizar usuário');
			throw err;
		}
	}, []);

	const deleteUsuario = useCallback(async (id: string) => {
		try {
			await usuarioService.delete(id);
			setUsuarios(prev => prev.filter(u => u.id !== id));
			toast.success('Usuário excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir usuário');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchUsuarios();
	}, [fetchUsuarios]);

	return {
		usuarios,
		loading,
		error,
		createUsuario,
		updateUsuario,
		deleteUsuario,
		refresh: fetchUsuarios,
	};
};

// Hook para clientes
export const useClientes = () => {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchClientes = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await clienteService.findAll();
			setClientes(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createCliente = useCallback(async (data: CreateClienteDto) => {
		try {
			const newCliente = await clienteService.create(data);
			setClientes(prev => [...prev, newCliente]);
			toast.success('Cliente criado com sucesso!');
			return newCliente;
		} catch (err: any) {
			toast.error('Erro ao criar cliente');
			throw err;
		}
	}, []);

	const updateCliente = useCallback(async (id: string, data: UpdateClienteDto) => {
		try {
			const updatedCliente = await clienteService.update(id, data);
			setClientes(prev => prev.map(c => c.id === id ? updatedCliente : c));
			toast.success('Cliente atualizado com sucesso!');
			return updatedCliente;
		} catch (err: any) {
			toast.error('Erro ao atualizar cliente');
			throw err;
		}
	}, []);

	const deleteCliente = useCallback(async (id: string) => {
		try {
			await clienteService.delete(id);
			setClientes(prev => prev.filter(c => c.id !== id));
			toast.success('Cliente excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir cliente');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchClientes();
	}, [fetchClientes]);

	return {
		clientes,
		loading,
		error,
		createCliente,
		updateCliente,
		deleteCliente,
		refresh: fetchClientes,
	};
};

// Hook para fornecedores
export const useFornecedores = () => {
	const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFornecedores = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fornecedorService.findAll();
			setFornecedores(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createFornecedor = useCallback(async (data: CreateFornecedorDto) => {
		try {
			const newFornecedor = await fornecedorService.create(data);
			setFornecedores(prev => [...prev, newFornecedor]);
			toast.success('Fornecedor criado com sucesso!');
			return newFornecedor;
		} catch (err: any) {
			toast.error('Erro ao criar fornecedor');
			throw err;
		}
	}, []);

	const updateFornecedor = useCallback(async (id: string, data: UpdateFornecedorDto) => {
		try {
			const updatedFornecedor = await fornecedorService.update(id, data);
			setFornecedores(prev => prev.map(f => f.id === id ? updatedFornecedor : f));
			toast.success('Fornecedor atualizado com sucesso!');
			return updatedFornecedor;
		} catch (err: any) {
			toast.error('Erro ao atualizar fornecedor');
			throw err;
		}
	}, []);

	const deleteFornecedor = useCallback(async (id: string) => {
		try {
			await fornecedorService.delete(id);
			setFornecedores(prev => prev.filter(f => f.id !== id));
			toast.success('Fornecedor excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir fornecedor');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchFornecedores();
	}, [fetchFornecedores]);

	return {
		fornecedores,
		loading,
		error,
		createFornecedor,
		updateFornecedor,
		deleteFornecedor,
		refresh: fetchFornecedores,
	};
};

// Hook para tipos de produtos
export const useTiposProdutos = () => {
	const [tipos, setTipos] = useState<TipoProduto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTipos = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await tipoProdutoService.findAll();
			setTipos(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createTipo = useCallback(async (data: CreateTipoProdutoDto) => {
		try {
			const newTipo = await tipoProdutoService.create(data);
			setTipos(prev => [...prev, newTipo]);
			toast.success('Tipo de produto criado com sucesso!');
			return newTipo;
		} catch (err: any) {
			toast.error('Erro ao criar tipo de produto');
			throw err;
		}
	}, []);

	const updateTipo = useCallback(async (id: string, data: UpdateTipoProdutoDto) => {
		try {
			const updatedTipo = await tipoProdutoService.update(id, data);
			setTipos(prev => prev.map(t => t.id === id ? updatedTipo : t));
			toast.success('Tipo de produto atualizado com sucesso!');
			return updatedTipo;
		} catch (err: any) {
			toast.error('Erro ao atualizar tipo de produto');
			throw err;
		}
	}, []);

	const deleteTipo = useCallback(async (id: string) => {
		try {
			await tipoProdutoService.delete(id);
			setTipos(prev => prev.filter(t => t.id !== id));
			toast.success('Tipo de produto excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir tipo de produto');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchTipos();
	}, [fetchTipos]);

	return {
		tipos,
		loading,
		error,
		createTipo,
		updateTipo,
		deleteTipo,
		refresh: fetchTipos,
	};
};

// Hook para marcas de produtos
export const useMarcasProdutos = () => {
	const [marcas, setMarcas] = useState<MarcaProduto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMarcas = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await marcaProdutoService.findAll();
			setMarcas(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createMarca = useCallback(async (data: CreateMarcaProdutoDto) => {
		try {
			const newMarca = await marcaProdutoService.create(data);
			setMarcas(prev => [...prev, newMarca]);
			toast.success('Marca de produto criada com sucesso!');
			return newMarca;
		} catch (err: any) {
			toast.error('Erro ao criar marca de produto');
			throw err;
		}
	}, []);

	const updateMarca = useCallback(async (id: string, data: UpdateMarcaProdutoDto) => {
		try {
			const updatedMarca = await marcaProdutoService.update(id, data);
			setMarcas(prev => prev.map(m => m.id === id ? updatedMarca : m));
			toast.success('Marca de produto atualizada com sucesso!');
			return updatedMarca;
		} catch (err: any) {
			toast.error('Erro ao atualizar marca de produto');
			throw err;
		}
	}, []);

	const deleteMarca = useCallback(async (id: string) => {
		try {
			await marcaProdutoService.delete(id);
			setMarcas(prev => prev.filter(m => m.id !== id));
			toast.success('Marca de produto excluída com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir marca de produto');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchMarcas();
	}, [fetchMarcas]);

	return {
		marcas,
		loading,
		error,
		createMarca,
		updateMarca,
		deleteMarca,
		refresh: fetchMarcas,
	};
};

// Hook para categorias de produtos
export const useCategoriasProdutos = () => {
	const [categorias, setCategorias] = useState<CategoriaProduto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCategorias = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await categoriaProdutoService.findAll();
			setCategorias(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createCategoria = useCallback(async (data: CreateCategoriaProdutoDto) => {
		try {
			const newCategoria = await categoriaProdutoService.create(data);
			setCategorias(prev => [...prev, newCategoria]);
			toast.success('Categoria criada com sucesso!');
			return newCategoria;
		} catch (err: any) {
			toast.error('Erro ao criar categoria');
			throw err;
		}
	}, []);

	const updateCategoria = useCallback(async (id: string, data: UpdateCategoriaProdutoDto) => {
		try {
			const updatedCategoria = await categoriaProdutoService.update(id, data);
			setCategorias(prev => prev.map(c => c.id === id ? updatedCategoria : c));
			toast.success('Categoria atualizada com sucesso!');
			return updatedCategoria;
		} catch (err: any) {
			toast.error('Erro ao atualizar categoria');
			throw err;
		}
	}, []);

	const deleteCategoria = useCallback(async (id: string) => {
		try {
			await categoriaProdutoService.delete(id);
			setCategorias(prev => prev.filter(c => c.id !== id));
			toast.success('Categoria excluída com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir categoria');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchCategorias();
	}, [fetchCategorias]);

	return {
		categorias,
		loading,
		error,
		createCategoria,
		updateCategoria,
		deleteCategoria,
		refresh: fetchCategorias,
	};
};

// Hook para produtos
export const useProdutos = () => {
	const [produtos, setProdutos] = useState<Produto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProdutos = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await produtoService.findAll();
			setProdutos(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createProduto = useCallback(async (data: CreateProdutoDto) => {
		try {
			const newProduto = await produtoService.create(data);
			setProdutos(prev => [...prev, newProduto]);
			toast.success('Produto criado com sucesso!');
			return newProduto;
		} catch (err: any) {
			toast.error('Erro ao criar produto');
			throw err;
		}
	}, []);

	const updateProduto = useCallback(async (id: string, data: UpdateProdutoDto) => {
		try {
			const updatedProduto = await produtoService.update(id, data);
			setProdutos(prev => prev.map(p => p.id === id ? updatedProduto : p));
			toast.success('Produto atualizado com sucesso!');
			return updatedProduto;
		} catch (err: any) {
			toast.error('Erro ao atualizar produto');
			throw err;
		}
	}, []);

	const deleteProduto = useCallback(async (id: string) => {
		try {
			await produtoService.delete(id);
			setProdutos(prev => prev.filter(p => p.id !== id));
			toast.success('Produto excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir produto');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchProdutos();
	}, [fetchProdutos]);

	return {
		produtos,
		loading,
		error,
		createProduto,
		updateProduto,
		deleteProduto,
		refresh: fetchProdutos,
	};
};

// Hook para estoque
export const useEstoque = () => {
	const [estoque, setEstoque] = useState<Estoque[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEstoque = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await estoqueService.findAll();
			setEstoque(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createEstoque = useCallback(async (data: CreateEstoqueDto) => {
		try {
			const newEstoque = await estoqueService.create(data);
			setEstoque(prev => [...prev, newEstoque]);
			toast.success('Item de estoque criado com sucesso!');
			return newEstoque;
		} catch (err: any) {
			toast.error('Erro ao criar item de estoque');
			throw err;
		}
	}, []);

	const updateEstoque = useCallback(async (id: string, data: UpdateEstoqueDto) => {
		try {
			const updatedEstoque = await estoqueService.update(id, data);
			setEstoque(prev => prev.map(e => e.id === id ? updatedEstoque : e));
			toast.success('Item de estoque atualizado com sucesso!');
			return updatedEstoque;
		} catch (err: any) {
			toast.error('Erro ao atualizar item de estoque');
			throw err;
		}
	}, []);

	const deleteEstoque = useCallback(async (id: string) => {
		try {
			await estoqueService.delete(id);
			setEstoque(prev => prev.filter(e => e.id !== id));
			toast.success('Item de estoque excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir item de estoque');
			throw err;
		}
	}, []);

	const registrarMovimento = useCallback(async (estoqueId: string, data: MovimentoEstoqueDto) => {
		try {
			await estoqueService.registrarMovimento(estoqueId, data);
			toast.success('Movimento registrado com sucesso!');
			fetchEstoque(); // Atualizar lista após movimento
		} catch (err: any) {
			toast.error('Erro ao registrar movimento');
			throw err;
		}
	}, [fetchEstoque]);

	useEffect(() => {
		fetchEstoque();
	}, [fetchEstoque]);

	return {
		estoque,
		loading,
		error,
		createEstoque,
		updateEstoque,
		deleteEstoque,
		registrarMovimento,
		refresh: fetchEstoque,
	};
};

// Hook para vendas
export const useVendas = () => {
	const [vendas, setVendas] = useState<Venda[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchVendas = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await vendaService.findAll();
			setVendas(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const createVenda = useCallback(async (data: CreateVendaDto) => {
		try {
			const newVenda = await vendaService.create(data);
			setVendas(prev => [...prev, newVenda]);
			toast.success('Venda criada com sucesso!');
			return newVenda;
		} catch (err: any) {
			toast.error('Erro ao criar venda');
			throw err;
		}
	}, []);

	const updateVenda = useCallback(async (id: string, data: UpdateVendaDto) => {
		try {
			const updatedVenda = await vendaService.update(id, data);
			setVendas(prev => prev.map(v => v.id === id ? updatedVenda : v));
			toast.success('Venda atualizada com sucesso!');
			return updatedVenda;
		} catch (err: any) {
			toast.error('Erro ao atualizar venda');
			throw err;
		}
	}, []);

	const deleteVenda = useCallback(async (id: string) => {
		try {
			await vendaService.delete(id);
			setVendas(prev => prev.filter(v => v.id !== id));
			toast.success('Venda excluída com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir venda');
			throw err;
		}
	}, []);

	const concluirVenda = useCallback(async (id: string) => {
		try {
			await vendaService.concluirVenda(id);
			setVendas(prev => prev.map(v => v.id === id ? { ...v, status: 'Concluida' as const } : v));
			toast.success('Venda concluída com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao concluir venda');
			throw err;
		}
	}, []);

	const cancelarVenda = useCallback(async (id: string) => {
		try {
			await vendaService.cancelarVenda(id);
			setVendas(prev => prev.map(v => v.id === id ? { ...v, status: 'Cancelada' as const } : v));
			toast.success('Venda cancelada com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao cancelar venda');
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchVendas();
	}, [fetchVendas]);

	return {
		vendas,
		loading,
		error,
		createVenda,
		updateVenda,
		deleteVenda,
		concluirVenda,
		cancelarVenda,
		refresh: fetchVendas,
	};
};

// Hook para estatísticas de clientes
export const useEstatisticasClientes = () => {
	const [estatisticas, setEstatisticas] = useState<EstatisticasCrescimentoClientes | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEstatisticas = useCallback(async () => {

		setLoading(true);
		setError(null);
		try {
			const data = await clienteService.getEstatisticasCrescimento();
			setEstatisticas(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEstatisticas();
	}, [fetchEstatisticas]);

	return {
		estatisticas,
		loading,
		error,
		refresh: fetchEstatisticas,
	};
};

// Hook para health check
export const useHealthCheck = () => {
	const [health, setHealth] = useState<HealthCheck | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const checkHealth = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await healthService.check();
			setHealth(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		health,
		loading,
		error,
		checkHealth,
	};
};
