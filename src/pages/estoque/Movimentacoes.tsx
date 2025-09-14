import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, TrendingDown, Package } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';

const MovimentacoesEstoque: React.FC = () => {
  const [movimentacoes] = useState([
    {
      id: '1',
      produto_nome: 'Notebook Dell Inspiron',
      sku: 'DELL-001',
      tipo_movimento: 'entrada',
      motivo: 'Compra de fornecedor',
      quantidade: 50,
      referencia: 'NF-001234',
      data_movimento: '2024-01-15T10:00:00Z',
      usuario: 'João Silva'
    },
    {
      id: '2',
      produto_nome: 'Mouse Logitech',
      sku: 'LOG-002',
      tipo_movimento: 'saida',
      motivo: 'Venda para cliente',
      quantidade: 25,
      referencia: 'VENDA-001',
      data_movimento: '2024-01-15T14:30:00Z',
      usuario: 'Maria Santos'
    },
    {
      id: '3',
      produto_nome: 'Teclado Mecânico',
      sku: 'TEC-003',
      tipo_movimento: 'entrada',
      motivo: 'Devolução de cliente',
      quantidade: 5,
      referencia: 'DEV-001',
      data_movimento: '2024-01-16T09:15:00Z',
      usuario: 'Pedro Oliveira'
    },
    {
      id: '4',
      produto_nome: 'Monitor Samsung 24"',
      sku: 'SAM-004',
      tipo_movimento: 'saida',
      motivo: 'Transferência para filial',
      quantidade: 10,
      referencia: 'TRANSF-001',
      data_movimento: '2024-01-16T16:45:00Z',
      usuario: 'Ana Costa'
    },
    {
      id: '5',
      produto_nome: 'Cabo HDMI',
      sku: 'CAB-005',
      tipo_movimento: 'entrada',
      motivo: 'Ajuste de inventário',
      quantidade: 100,
      referencia: 'INV-001',
      data_movimento: '2024-01-17T08:00:00Z',
      usuario: 'Carlos Lima'
    },
    {
      id: '6',
      produto_nome: 'Fone de Ouvido Bluetooth',
      sku: 'FON-006',
      tipo_movimento: 'saida',
      motivo: 'Produto danificado',
      quantidade: 2,
      referencia: 'DAN-001',
      data_movimento: '2024-01-17T11:20:00Z',
      usuario: 'Lucia Ferreira'
    },
    {
      id: '7',
      produto_nome: 'Carregador USB-C',
      sku: 'CAR-007',
      tipo_movimento: 'entrada',
      motivo: 'Compra de fornecedor',
      quantidade: 200,
      referencia: 'NF-001235',
      data_movimento: '2024-01-18T13:10:00Z',
      usuario: 'João Silva'
    },
    {
      id: '8',
      produto_nome: 'Webcam HD',
      sku: 'WEB-008',
      tipo_movimento: 'saida',
      motivo: 'Venda para cliente',
      quantidade: 15,
      referencia: 'VENDA-002',
      data_movimento: '2024-01-18T15:30:00Z',
      usuario: 'Maria Santos'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredMovimentacoes = movimentacoes.filter(movimentacao =>
    movimentacao.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.referencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredMovimentacoes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovimentacoes = filteredMovimentacoes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'entrada' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'entrada' ? 
      'bg-green-100 text-green-800' : 
      'bg-red-100 text-red-800';
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'entrada' ? 'Entrada' : 'Saída';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações de Estoque</h1>
          <p className="text-gray-600">Controle todas as movimentações de estoque</p>
        </div>
        <button className="btn-action add">
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Nova</div>
        </button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por produto, SKU, motivo ou referência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="input">
              <option value="">Todos os tipos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
            <button className="btn-action filter">
              <div className="icon-section">
                <Search className="h-4 w-4" />
              </div>
              <div className="text-section">Filtrar</div>
            </button>
          </div>
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
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMovimentacoes.map((movimentacao) => (
                <tr key={movimentacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {movimentacao.produto_nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {movimentacao.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTipoIcon(movimentacao.tipo_movimento)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(movimentacao.tipo_movimento)}`}>
                        {getTipoLabel(movimentacao.tipo_movimento)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movimentacao.quantidade}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movimentacao.motivo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movimentacao.referencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(movimentacao.data_movimento).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movimentacao.usuario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => console.log('Visualizar movimentação')
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => console.log('Editar movimentação')
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => console.log('Excluir movimentação'),
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
        totalItems={filteredMovimentacoes.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default MovimentacoesEstoque;
