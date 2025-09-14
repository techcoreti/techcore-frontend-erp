import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Layers } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import { useCategoriasProdutos } from '../../hooks/useApi';
import { CategoriaProduto, CreateCategoriaProdutoDto } from '../../types/api';

const CategoriasProdutos: React.FC = () => {
  const { categorias, loading, error, createCategoria, updateCategoria, deleteCategoria } = useCategoriasProdutos();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaProduto | null>(null);
  const [formData, setFormData] = useState<CreateCategoriaProdutoDto>({
    nome: '',
    descricao: '',
    ativo: true
  });

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategorias = filteredCategorias.slice(startIndex, endIndex);

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

  const handleEditClick = (categoria: CategoriaProduto) => {
    setSelectedCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
      ativo: categoria.ativo
    });
    setShowEditModal(true);
  };

  const handleViewClick = (categoria: CategoriaProduto) => {
    setSelectedCategoria(categoria);
    setShowViewModal(true);
  };

  const handleDeleteClick = async (categoria: CategoriaProduto) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      try {
        await deleteCategoria(categoria.id);
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
      }
    }
  };

  // Funções para operações CRUD
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategoria(formData);
      setShowCreateModal(false);
      setFormData({
        nome: '',
        descricao: '',
        ativo: true
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoria) return;
    
    try {
      await updateCategoria(selectedCategoria.id, formData);
      setShowEditModal(false);
      setSelectedCategoria(null);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Categorias de Produtos</h1>
          <p className="text-gray-600">Gerencie as categorias dos seus produtos</p>
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
            placeholder="Buscar categorias..."
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
            <span className="ml-2 text-gray-600">Carregando categorias...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Erro ao carregar categorias: {error}</p>
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
                    Categoria
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
                {paginatedCategorias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  paginatedCategorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Layers className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {categoria.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {categoria.descricao || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      categoria.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {categoria.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(categoria.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => handleViewClick(categoria)
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => handleEditClick(categoria)
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => handleDeleteClick(categoria),
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
        totalItems={filteredCategorias.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>
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
                    placeholder="Nome da categoria"
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
                    placeholder="Descrição da categoria"
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
                    Categoria ativa
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
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedCategoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Categoria</h2>
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
                    placeholder="Nome da categoria"
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
                    placeholder="Descrição da categoria"
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
                    Categoria ativa
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
      {showViewModal && selectedCategoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalhes da Categoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <p className="text-gray-900">{selectedCategoria.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <p className="text-gray-900">{selectedCategoria.descricao || 'Sem descrição'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedCategoria.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedCategoria.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Criado em
                </label>
                <p className="text-gray-900">
                  {new Date(selectedCategoria.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atualizado em
                </label>
                <p className="text-gray-900">
                  {new Date(selectedCategoria.updated_at).toLocaleString('pt-BR')}
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

export default CategoriasProdutos;
