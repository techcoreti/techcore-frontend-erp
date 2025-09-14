import { useState, useEffect } from 'react';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Hook genérico para paginação
export const usePagination = <T>(
  fetchFunction: (params: PaginationParams) => Promise<PaginationResponse<T> | T[]>,
  initialParams: Partial<PaginationParams> = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    ...initialParams
  });

  const fetchData = async (params: Partial<PaginationParams> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: pagination.search,
        ...params
      };

      const response = await fetchFunction(currentParams);
      
      // Verificar se a resposta tem estrutura de paginação
      if (Array.isArray(response)) {
        setData(response);
        setPagination(prev => ({
          ...prev,
          ...params,
          total: response.length,
          totalPages: Math.ceil(response.length / prev.limit)
        }));
      } else {
        const paginatedResponse = response as PaginationResponse<T>;
        setData(paginatedResponse.data);
        setPagination(prev => ({
          ...prev,
          ...params,
          total: paginatedResponse.total,
          totalPages: paginatedResponse.totalPages
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
      console.error('Erro na paginação:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchData({ page });
  };

  const handleItemsPerPageChange = (limit: number) => {
    fetchData({ limit, page: 1 });
  };

  const handleSearch = (search: string) => {
    fetchData({ search, page: 1 });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    fetchData,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    refetch: () => fetchData()
  };
};
