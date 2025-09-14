import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useEstatisticasClientes, useVendas, useClientes, useProdutos, useEstoque } from '../hooks/useApi';
import CrescimentoClientesCard from '../components/Cards/CrescimentoClientesCard';
import { EstatisticasCrescimento } from '../services/clienteEstatisticasService';

const Dashboard: React.FC = () => {
  const { estatisticas, loading: loadingEstatisticas } = useEstatisticasClientes();
  const { vendas, loading: loadingVendas } = useVendas();
  const { clientes, loading: loadingClientes } = useClientes();
  const { produtos, loading: loadingProdutos } = useProdutos();
  const { estoque, loading: loadingEstoque } = useEstoque();

  // Calcular estatísticas básicas
  const totalVendas = vendas.length;
  const totalClientes = clientes.length;
  const totalProdutos = produtos.length;
  const totalEstoque = estoque.reduce((acc, item) => acc + item.qtdeInicial, 0);

  // Calcular vendas por status
  const vendasConcluidas = vendas.filter(v => v.status === 'Concluida').length;
  const vendasPendentes = vendas.filter(v => v.status === 'Pendente').length;
  const vendasCanceladas = vendas.filter(v => v.status === 'Cancelada').length;

  // Calcular produtos com baixo estoque (menos de 10 unidades)
  const produtosBaixaEstoque = estoque.filter(item => item.qtdeInicial < 10);

  // Dados para gráfico de vendas por status
  const vendasStatusData = [
    { name: 'Concluídas', value: vendasConcluidas, color: '#10B981' },
    { name: 'Pendentes', value: vendasPendentes, color: '#F59E0B' },
    { name: 'Canceladas', value: vendasCanceladas, color: '#EF4444' }
  ];

  // Dados para gráfico de produtos por categoria (simulado)
  const produtosCategoriaData = [
    { name: 'Eletrônicos', value: Math.floor(totalProdutos * 0.3), color: '#3B82F6' },
    { name: 'Roupas', value: Math.floor(totalProdutos * 0.25), color: '#8B5CF6' },
    { name: 'Casa', value: Math.floor(totalProdutos * 0.2), color: '#10B981' },
    { name: 'Outros', value: Math.floor(totalProdutos * 0.25), color: '#F59E0B' }
  ];

  // Dados para gráfico de vendas por período (últimos 7 dias - simulado)
  const vendasPeriodoData = [
    { name: 'Seg', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Ter', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Qua', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Qui', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Sex', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Sáb', vendas: Math.floor(Math.random() * 20) + 5 },
    { name: 'Dom', vendas: Math.floor(Math.random() * 20) + 5 }
  ];

  const statCards = [
    {
      title: 'Total de Vendas',
      value: totalVendas.toLocaleString('pt-BR'),
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
      loading: loadingVendas
    },
    {
      title: 'Clientes Ativos',
      value: totalClientes.toLocaleString('pt-BR'),
      icon: Users,
      color: 'bg-green-500',
      change: estatisticas ? `+${estatisticas.crescimentoPercentual.toFixed(1)}%` : '+8%',
      changeType: 'positive',
      loading: loadingClientes
    },
    {
      title: 'Produtos Cadastrados',
      value: totalProdutos.toLocaleString('pt-BR'),
      icon: Package,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive',
      loading: loadingProdutos
    },
    {
      title: 'Total em Estoque',
      value: totalEstoque.toLocaleString('pt-BR'),
      icon: BarChart3,
      color: 'bg-orange-500',
      change: '-2%',
      changeType: 'negative',
      loading: loadingEstoque
    }
  ];

  const isLoading = loadingVendas || loadingClientes || loadingProdutos || loadingEstoque;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                {card.loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                )}
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 ${card.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ml-1 ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Status</h3>
          {isLoading ? (
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vendasStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vendasStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Produtos por Categoria */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos por Categoria</h3>
          {isLoading ? (
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={produtosCategoriaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {produtosCategoriaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Período */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas dos Últimos 7 Dias</h3>
          {isLoading ? (
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vendasPeriodoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vendas" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Crescimento de Clientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Clientes</h3>
          {loadingEstatisticas ? (
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ) : estatisticas as unknown as EstatisticasCrescimento ? (
            <CrescimentoClientesCard estatisticas={estatisticas as unknown as EstatisticasCrescimento} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Não foi possível carregar as estatísticas</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {produtosBaixaEstoque.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Produtos com Baixo Estoque
              </h4>
              <p className="text-sm text-yellow-700">
                {produtosBaixaEstoque.length} produto(s) com estoque abaixo de 10 unidades
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;