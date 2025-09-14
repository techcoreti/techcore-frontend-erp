import React from 'react';
import { FileText, Download, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { mockVendasChartData, mockProdutosChartData } from '../data/mockData';

const Relatorios: React.FC = () => {
  const vendasData = mockVendasChartData;
  const produtosData = mockProdutosChartData;

  const relatorios = [
    {
      id: 'vendas-mensais',
      titulo: 'Relatório de Vendas Mensais',
      descricao: 'Análise de vendas por mês',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 'produtos-categoria',
      titulo: 'Produtos por Categoria',
      descricao: 'Distribuição de produtos por categoria',
      icon: PieChart,
      color: 'bg-green-500'
    },
    {
      id: 'performance-vendas',
      titulo: 'Performance de Vendas',
      descricao: 'Evolução das vendas ao longo do tempo',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'estoque-baixo',
      titulo: 'Relatório de Estoque Baixo',
      descricao: 'Produtos com estoque abaixo do mínimo',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análises e relatórios do seu negócio</p>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatorios.map((relatorio) => {
          const Icon = relatorio.icon;
          return (
            <div key={relatorio.id} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`${relatorio.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {relatorio.titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {relatorio.descricao}
              </p>
              <button className="btn btn-outline w-full">
                Gerar Relatório
              </button>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Mensais */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vendas Mensais</h3>
            <button className="btn btn-outline btn-sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Produtos por Categoria */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produtos por Categoria</h3>
            <button className="btn btn-outline btn-sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={produtosData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {produtosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {produtosData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance de Vendas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance de Vendas</h3>
          <button className="btn btn-outline btn-sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={vendasData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
              labelStyle={{ color: '#374151' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filtros Avançados */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Período Inicial</label>
            <input type="date" className="input w-full" />
          </div>
          <div>
            <label className="label">Período Final</label>
            <input type="date" className="input w-full" />
          </div>
          <div>
            <label className="label">Tipo de Relatório</label>
            <select className="input w-full">
              <option value="">Selecione...</option>
              <option value="vendas">Vendas</option>
              <option value="produtos">Produtos</option>
              <option value="clientes">Clientes</option>
              <option value="estoque">Estoque</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary">
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
