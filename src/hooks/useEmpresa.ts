import { useState, useEffect, useCallback } from 'react';
import { empresaService, Empresa } from '../services/empresaService';

export const useEmpresa = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresa = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const empresaData = await empresaService.getEmpresaLogada();
      setEmpresa(empresaData);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar dados da empresa';
      setError(errorMessage);
      console.error('Erro ao buscar empresa:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpresa();
  }, [fetchEmpresa]);

  const refetch = () => {
    fetchEmpresa();
  };

  return {
    empresa,
    loading,
    error,
    refetch
  };
};
