import React from 'react';
import { UserPlus, TrendingUp } from 'lucide-react';
import { useEstatisticasCrescimento } from '../../hooks/useEstatisticasCrescimento';
import { EstatisticasCrescimento } from '../../services/clienteEstatisticasService';

const CrescimentoClientesCard: React.FC<{ estatisticas: EstatisticasCrescimento }> = ({ estatisticas }) => {
  const {loading, error } = useEstatisticasCrescimento();

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg mr-3">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crescimento de Clientes</h3>
              <p className="text-sm text-gray-500">Carregando...</p>
            </div>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg mr-3">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crescimento de Clientes</h3>
              <p className="text-sm text-red-500">Erro ao carregar dados</p>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!estatisticas) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gray-500 p-3 rounded-lg mr-3">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crescimento de Clientes</h3>
              <p className="text-sm text-gray-500">Nenhum dado disponível</p>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Não há dados de crescimento disponíveis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-green-500 p-3 rounded-lg mr-3">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crescimento de Clientes</h3>
            <p className="text-sm text-gray-500">{estatisticas.periodo}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Atual</span>
          <span className="text-2xl font-bold text-gray-900">{estatisticas.total_atual}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Novos Este Mês</span>
          <span className="text-lg font-semibold text-green-600">+{estatisticas.novos_este_mes}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Crescimento</span>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-lg font-semibold text-green-600">+{estatisticas.crescimento_percentual}%</span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ativos: {estatisticas.ativos}</span>
            <span className="text-gray-600">Inativos: {estatisticas.inativos}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrescimentoClientesCard;
