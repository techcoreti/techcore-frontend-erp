import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Truck, MapPin, Phone, Eye } from 'lucide-react';
import { useFornecedores } from '../hooks/useFornecedores';
import { Fornecedor } from '../services/fornecedorService';
import FornecedorForm from '../components/Forms/FornecedorForm';
import DropdownMenu from '../components/DropdownMenu';
import Pagination from '../components/Pagination';

const Fornecedores: React.FC = () => {
  const { 
    fornecedores, 
    loading, 
    error, 
    createFornecedor, 
    updateFornecedor, 
    deleteFornecedor,
    fetchFornecedores 
  } = useFornecedores();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cpfCnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredFornecedores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFornecedores = filteredFornecedores.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setShowForm(true);
  };

  const handleDelete = async (fornecedor: Fornecedor) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await deleteFornecedor(fornecedor.id);
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
      }
    }
  };

  const handleSaveFornecedor = async (fornecedorData: any) => {
    try {
      if (editingFornecedor) {
        // Editar fornecedor existente
        await updateFornecedor(editingFornecedor.id, fornecedorData);
      } else {
        // Novo fornecedor
        await createFornecedor(fornecedorData);
      }
      setShowForm(false);
      setEditingFornecedor(null);
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    }
  };

  const handleNewFornecedor = () => {
    setEditingFornecedor(null);
    setShowForm(true);
  };

  const handleViewEnderecos = (fornecedor: Fornecedor) => {
    // Navegar para página de endereços do fornecedor
    window.location.href = `/fornecedores/enderecos?fornecedor=${fornecedor.id}`;
  };

  const handleViewContatos = (fornecedor: Fornecedor) => {
    // Navegar para página de contatos do fornecedor
    window.location.href = `/fornecedores/contatos?fornecedor=${fornecedor.id}`;
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <FornecedorForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSaveFornecedor}
          fornecedor={editingFornecedor}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600">Gerencie seus fornecedores</p>
        </div>
        <button onClick={handleNewFornecedor} className="btn-action add">
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Novo</div>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando fornecedores...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar fornecedores</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => fetchFornecedores()}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && paginatedFornecedores.length > 0 && (
        <>
          {/* Search */}
      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF/CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFornecedores.map((fornecedor) => (
                <tr key={fornecedor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {fornecedor.razaoSocial}
                        </div>
                        {fornecedor.nomeFantasia && (
                          <div className="text-sm text-gray-500">
                            {fornecedor.nomeFantasia}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fornecedor.cpfCnpj || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium mb-1">Fornecimento:</div>
                        <div className="space-y-1">
                          {fornecedor.tipoFornecimento.map((tipo, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              <span className="capitalize">{tipo}</span>
                            </div>
                          ))}
                        </div>
                        {/* Seta do tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      fornecedor.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => handleEdit(fornecedor)
                          },
                          {
                            label: 'Ver Endereços',
                            icon: <MapPin className="dropdown-icon address" />,
                            onClick: () => handleViewEnderecos(fornecedor)
                          },
                          {
                            label: 'Ver Contatos',
                            icon: <Phone className="dropdown-icon contact" />,
                            onClick: () => handleViewContatos(fornecedor)
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => handleDelete(fornecedor),
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
        </>
      )}

      {/* Empty State */}
      {!loading && !error && paginatedFornecedores.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Truck className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece cadastrando seu primeiro fornecedor'
            }
          </p>
        </div>
			)}
			
			{/* Pagination */}
      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredFornecedores.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
			)}
    </div>
  );
};

export default Fornecedores;
