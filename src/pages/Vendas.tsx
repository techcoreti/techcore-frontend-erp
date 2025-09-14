import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingCart, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockVendas } from '../data/mockData';
import DropdownMenu from '../components/DropdownMenu';
import Pagination from '../components/Pagination';
import { Venda } from '../types';

const Vendas: React.FC = () => {
  const [vendas] = useState<Venda[]>(mockVendas);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredVendas = vendas.filter(venda =>
    venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.clienteId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendas = filteredVendas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluida':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Cancelada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluida':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600">Gerencie suas vendas</p>
        </div>
        <button className="btn-action add">
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Novo</div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendas.filter(v => v.status === 'Concluida').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg flex-shrink-0 self-start">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendas.filter(v => v.status === 'Pendente').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg flex-shrink-0 self-start">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Canceladas</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendas.filter(v => v.status === 'Cancelada').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg flex-shrink-0 self-start">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Vendido</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {vendas.reduce((sum, v) => sum + v.totalLiquido, 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg flex-shrink-0 self-start">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID da Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bruto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desconto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Líquido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{venda.id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Cliente {venda.clienteId?.slice(-4) || 'Consumidor Final'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {venda.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {venda.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {venda.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(venda.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(venda.status)}`}>
                        {venda.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(venda.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => console.log('Visualizar venda')
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => console.log('Editar venda')
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => console.log('Excluir venda'),
                            className: 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredVendas.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Vendas;
