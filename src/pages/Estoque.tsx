import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { mockEstoque } from '../data/mockData';
import DropdownMenu from '../components/DropdownMenu';
import Pagination from '../components/Pagination';
import { Estoque as EstoqueType } from '../types';

const Estoque: React.FC = () => {
  const [estoque] = useState<EstoqueType[]>(mockEstoque);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredEstoque = estoque.filter(item =>
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigoBarras?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredEstoque.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEstoque = filteredEstoque.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600">Controle de estoque e movimentações</p>
        </div>
        <button className="btn-action add">
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Novo</div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total em Estoque</p>
              <p className="text-2xl font-bold text-gray-900">
                {estoque.reduce((sum, item) => sum + item.qtdeAtual, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg flex-shrink-0 self-start">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {estoque.reduce((sum, item) => sum + (item.precoCusto * item.qtdeAtual), 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg flex-shrink-0 self-start">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Produtos Baixo Estoque</p>
              <p className="text-2xl font-bold text-gray-900">
                {estoque.filter(item => item.qtdeAtual < 5).length}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-lg flex-shrink-0 self-start">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por SKU ou código de barras..."
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
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Barras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEstoque.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Produto {item.produtoId.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sku || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.codigoBarras || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {item.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.qtdeAtual < 5 
                        ? 'bg-red-100 text-red-800' 
                        : item.qtdeAtual < 10
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.qtdeAtual} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => console.log('Visualizar estoque')
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => console.log('Editar estoque')
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => console.log('Excluir estoque'),
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
        totalItems={filteredEstoque.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Estoque;
