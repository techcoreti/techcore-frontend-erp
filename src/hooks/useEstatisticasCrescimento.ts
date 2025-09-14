import { useState, useEffect } from 'react';
import { clienteEstatisticasService, EstatisticasCrescimento } from '../services/clienteEstatisticasService';

export const useEstatisticasCrescimento = () => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasCrescimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteEstatisticasService.getEstatisticasCrescimento();
      setEstatisticas(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar estatísticas de crescimento:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  return {
    estatisticas,
    loading,
    error,
    refetch: fetchEstatisticas
  };
};
