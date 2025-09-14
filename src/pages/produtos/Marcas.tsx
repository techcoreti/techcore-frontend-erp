import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Tag } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import { useMarcasProdutos } from '../../hooks/useApi';
import { MarcaProduto, CreateMarcaProdutoDto } from '../../types/api';

const MarcasProdutos: React.FC = () => {
  const { marcas, loading, error, createMarca, updateMarca, deleteMarca } = useMarcasProdutos();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<MarcaProduto | null>(null);
  const [formData, setFormData] = useState<CreateMarcaProdutoDto>({
    nome: '',
    descricao: '',
    ativo: true
  });

  const filteredMarcas = marcas.filter(marca =>
    marca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marca.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMarcas = filteredMarcas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  // Funções para manipular modais
  const handleCreateClick = () => {
    setFormData({
      nome: '',
      descricao: '',
      ativo: true
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (marca: MarcaProduto) => {
    setSelectedMarca(marca);
    setFormData({
      nome: marca.nome,
      descricao: marca.descricao || '',
      ativo: marca.ativo
    });
    setShowEditModal(true);
  };

  const handleViewClick = (marca: MarcaProduto) => {
    setSelectedMarca(marca);
    setShowViewModal(true);
  };

  const handleDeleteClick = async (marca: MarcaProduto) => {
    if (window.confirm(`Tem certeza que deseja excluir a marca "${marca.nome}"?`)) {
      try {
        await deleteMarca(marca.id);
      } catch (error) {
        console.error('Erro ao excluir marca:', error);
      }
    }
  };

  // Funções para operações CRUD
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMarca(formData);
      setShowCreateModal(false);
      setFormData({
        nome: '',
        descricao: '',
        ativo: true
      });
    } catch (error) {
      console.error('Erro ao criar marca:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarca) return;
    
    try {
      await updateMarca(selectedMarca.id, formData);
      setShowEditModal(false);
      setSelectedMarca(null);
    } catch (error) {
      console.error('Erro ao atualizar marca:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marcas de Produtos</h1>
          <p className="text-gray-600">Gerencie as marcas dos seus produtos</p>
        </div>
        <button className="btn-action add" onClick={handleCreateClick}>
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Novo</div>
        </button>
      </div>

      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar marcas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando marcas...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Erro ao carregar marcas: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMarcas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma marca encontrada
                    </td>
                  </tr>
                ) : (
                  paginatedMarcas.map((marca) => (
                <tr key={marca.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {marca.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {marca.descricao || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      marca.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {marca.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(marca.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => handleViewClick(marca)
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => handleEditClick(marca)
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => handleDeleteClick(marca),
                            className: 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredMarcas.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Marca</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="input w-full"
                    placeholder="Nome da marca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="input w-full"
                    rows={3}
                    placeholder="Descrição da marca"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Marca ativa
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedMarca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Marca</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="input w-full"
                    placeholder="Nome da marca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="input w-full"
                    rows={3}
                    placeholder="Descrição da marca"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Marca ativa
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && selectedMarca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalhes da Marca</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <p className="text-gray-900">{selectedMarca.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <p className="text-gray-900">{selectedMarca.descricao || 'Sem descrição'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedMarca.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedMarca.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Criado em
                </label>
                <p className="text-gray-900">
                  {new Date(selectedMarca.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atualizado em
                </label>
                <p className="text-gray-900">
                  {new Date(selectedMarca.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarcasProdutos;
