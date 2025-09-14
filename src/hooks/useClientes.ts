import { useState, useEffect, useCallback } from 'react';
import { clienteService, Cliente } from '../services/clienteService';
import type { ClienteCreate } from '../services/clienteService';
import toast from 'react-hot-toast';

// Hook para gerenciar clientes
export const useClientes = () => {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchClientes = async (params?: { page?: number; limit?: number; search?: string }) => {
		setLoading(true);
		setError(null);
		try {
			const response = await clienteService.getAll(params);
			setClientes(response || []);
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar clientes');
			toast.error('Erro ao carregar clientes');
		} finally {
			setLoading(false);
		}
	};

	const createCliente = async (data: ClienteCreate) => {
		try {
			const novoCliente = await clienteService.create(data);
			setClientes(prev => [...prev, novoCliente]);
			toast.success('Cliente criado com sucesso!');
			return novoCliente;
		} catch (err: any) {
			toast.error('Erro ao criar cliente');
			throw err;
		}
	};

	const updateCliente = async (id: string, data: Partial<ClienteCreate>) => {
		try {
			const clienteAtualizado = await clienteService.update(id, data);
			setClientes(prev => prev.map(c => c.id === id ? clienteAtualizado : c));
			toast.success('Cliente atualizado com sucesso!');
			return clienteAtualizado;
		} catch (err: any) {
			toast.error('Erro ao atualizar cliente');
			throw err;
		}
	};

	const deleteCliente = async (id: string) => {
		try {
			await clienteService.delete(id);
			setClientes(prev => prev.filter(c => c.id !== id));
			toast.success('Cliente excluído com sucesso!');
		} catch (err: any) {
			toast.error('Erro ao excluir cliente');
			throw err;
		}
	};

	useEffect(() => {
		fetchClientes();
	}, []);

	return {
		clientes,
		loading,
		error,
		fetchClientes,
		createCliente,
		updateCliente,
		deleteCliente,
		refetch: () => fetchClientes()
	};
};

// Hook para gerenciar um cliente específico
export const useCliente = (id: string) => {
	const [cliente, setCliente] = useState<Cliente | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCliente = useCallback(async () => {

		if (!id) return;

		setLoading(true);
		setError(null);
		try {
			const response = await clienteService.getById(id);
			setCliente(response);
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar cliente');
			toast.error('Erro ao carregar cliente');
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchCliente();
	}, [id, fetchCliente]);

	return {
		cliente,
		loading,
		error,
		refetch: fetchCliente
	};
};
