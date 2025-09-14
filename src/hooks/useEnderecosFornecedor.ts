import { useState, useCallback } from 'react';
import { enderecoFornecedorService, EnderecoFornecedor, CreateEnderecoFornecedorData } from '../services/enderecoFornecedorService';
import toast from 'react-hot-toast';

// Hook para gerenciar endereços de fornecedores
export const useEnderecosFornecedor = (fornecedorId: string) => {
  const [enderecos, setEnderecos] = useState<EnderecoFornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnderecos = useCallback(async () => {
    if (!fornecedorId) return;
    
    setLoading(true);
    setError(null);
    try {
      const enderecosData = await enderecoFornecedorService.getEnderecosByFornecedorId(fornecedorId);
      setEnderecos(enderecosData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar endereços');
      toast.error('Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  }, [fornecedorId]);

  const createEndereco = useCallback(async (enderecoData: CreateEnderecoFornecedorData) => {
    try {
      const novoEndereco = await enderecoFornecedorService.createEndereco(fornecedorId, enderecoData);
      setEnderecos(prev => [...prev, novoEndereco]);
      toast.success('Endereço criado com sucesso!');
      return novoEndereco;
    } catch (err: any) {
      toast.error('Erro ao criar endereço');
      throw err;
    }
  }, [fornecedorId]);

  const updateEndereco = useCallback(async (enderecoId: string, enderecoData: CreateEnderecoFornecedorData) => {
    try {
      const enderecoAtualizado = await enderecoFornecedorService.updateEndereco(fornecedorId, enderecoId, enderecoData);
      setEnderecos(prev => prev.map(e => e.id === enderecoId ? enderecoAtualizado : e));
      toast.success('Endereço atualizado com sucesso!');
      return enderecoAtualizado;
    } catch (err: any) {
      toast.error('Erro ao atualizar endereço');
      throw err;
    }
  }, [fornecedorId]);

  const deleteEndereco = useCallback(async (enderecoId: string) => {
    try {
      await enderecoFornecedorService.deleteEndereco(fornecedorId, enderecoId);
      setEnderecos(prev => prev.filter(e => e.id !== enderecoId));
      toast.success('Endereço excluído com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao excluir endereço');
      throw err;
    }
  }, [fornecedorId]);

  return {
    enderecos,
    loading,
    error,
    fetchEnderecos,
    createEndereco,
    updateEndereco,
    deleteEndereco,
    refetch: fetchEnderecos
  };
};
