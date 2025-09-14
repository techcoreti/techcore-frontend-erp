import { useState, useEffect, useCallback } from 'react';
import { fornecedorService, Fornecedor } from '../services/fornecedorService';
import type { FornecedorCreate } from '../services/fornecedorService';
import toast from 'react-hot-toast';

// Hook para gerenciar fornecedores
export const useFornecedores = () => {
	const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFornecedores = async (params?: { page?: number; limit?: number; search?: string }) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fornecedorService.getAll(params);
			setFornecedores(response || []);
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar fornecedores');
			toast.error('Erro ao carregar fornecedores');
		} finally {
			setLoading(false);
		}
	};

	const createFornecedor = async (data: FornecedorCreate) => {
		try {
			debugger;
			const novoFornecedor = await fornecedorService.create(data);
			setFornecedores(prev => [...prev, novoFornecedor]);
			toast.success('Fornecedor criado com sucesso!');
			return novoFornecedor;
		} catch (err: any) {
			toast.error('Erro ao criar fornecedor');
			throw err;
		}
	};

	const updateFornecedor = async (id: string, data: Partial<FornecedorCreate>) => {
		try {
			const fornecedorAtualizado = await fornecedorService.update(id, data);
			setFornecedores(prev => prev.map(f => f.id === id ? fornecedorAtualizado : f));
			toast.success('Fornecedor atualizado com sucesso!');
			return fornecedorAtualizado;
		} catch (err: any) {
			toast.error('Erro ao atualizar fornecedor');
			throw err;
		}
	};

	const deleteFornecedor = async (id: string) => {
		try {
			await fornecedorService.delete(id);
			setFornecedores(prev => prev.filter(f => f.id !== id));
			toast.success('Fornecedor excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir fornecedor');
			throw err;
		}
	};

	useEffect(() => {
		fetchFornecedores();
	}, []);

	return {
		fornecedores,
		loading,
		error,
		fetchFornecedores,
		createFornecedor,
		updateFornecedor,
		deleteFornecedor,
		refetch: () => fetchFornecedores()
	};
};

// Hook para gerenciar um fornecedor específico
export const useFornecedor = (id: string) => {
	const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFornecedor = useCallback(async () => {
		if (!id) return;

		setLoading(true);
		setError(null);
		try {
			const response = await fornecedorService.getById(id);
			setFornecedor(response);
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar fornecedor');
			toast.error('Erro ao carregar fornecedor');
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchFornecedor();
	}, [id, fetchFornecedor]);

	return {
		fornecedor,
		loading,
		error,
		refetch: fetchFornecedor
	};
};
