import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import EnderecoFornecedorForm from '../../components/Forms/EnderecoFornecedorForm';
import { useFornecedores } from '../../hooks/useFornecedores';
import { enderecoFornecedorService, EnderecoFornecedor } from '../../services/enderecoFornecedorService';
import { formatCEP } from '../../config/api';
import toast from 'react-hot-toast';

const EnderecosFornecedores: React.FC = () => {
  const { fornecedores, loading: fornecedoresLoading } = useFornecedores();
  const [enderecos, setEnderecos] = useState<EnderecoFornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState<EnderecoFornecedor | null>(null);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Função para buscar endereços de um fornecedor específico
  const fetchEnderecos = async (fornecedorId: string) => {
    if (!fornecedorId) return;
    
    setLoading(true);
    try {
      const enderecosData = await enderecoFornecedorService.getEnderecosByFornecedorId(fornecedorId);
      setEnderecos(enderecosData);
    } catch (error: unknown) {
      console.error('Erro ao buscar endereços:', error);
      toast.error('Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter nome do fornecedor
  const getFornecedorNome = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? (fornecedor.nomeFantasia || fornecedor.razaoSocial) : 'Fornecedor não encontrado';
  };

  // Função para obter fornecedor selecionado
  const selectedFornecedor = fornecedores.find(f => f.id === selectedFornecedorId);

  // Filtrar endereços baseado no termo de busca
  const filteredEnderecos = enderecos.filter(endereco => {
    const fornecedorNome = getFornecedorNome(endereco.fornecedorId);
    return fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           endereco.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
           endereco.municipio.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredEnderecos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnderecos = filteredEnderecos.slice(startIndex, endIndex);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleNovoEndereco = () => {
    if (!selectedFornecedorId) {
      toast.error('Selecione um fornecedor primeiro');
      return;
    }
    setEditingEndereco(null);
    setShowModal(true);
  };

  const handleEditEndereco = (endereco: EnderecoFornecedor) => {
    setEditingEndereco(endereco);
    setShowModal(true);
  };

  const handleDeleteEndereco = async (endereco: EnderecoFornecedor) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await enderecoFornecedorService.deleteEndereco(endereco.fornecedorId, endereco.id);
        toast.success('Endereço excluído com sucesso!');
        fetchEnderecos(selectedFornecedorId);
      } catch (error: unknown) {
        console.error('Erro ao excluir endereço:', error);
        toast.error('Erro ao excluir endereço');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEndereco(null);
  };

  const handleEnderecoSuccess = () => {
    fetchEnderecos(selectedFornecedorId);
  };

  // Effect para buscar endereços quando o fornecedor selecionado mudar
  useEffect(() => {
    if (selectedFornecedorId) {
      fetchEnderecos(selectedFornecedorId);
    } else {
      setEnderecos([]);
    }
  }, [selectedFornecedorId]);

  return (
    <div className="space-y-6">
      {!showModal ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Endereços de Fornecedores
              </h1>
              <p className="text-gray-600">Gerencie os endereços dos seus fornecedores</p>
            </div>
            <button onClick={handleNovoEndereco} className="btn-action add">
              <div className="icon-section">
                <Plus className="h-4 w-4" />
              </div>
              <div className="text-section">
                Novo
              </div>
            </button>
          </div>

          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Select de Fornecedores */}
              <div>
                <select
                  value={selectedFornecedorId}
                  onChange={(e) => setSelectedFornecedorId(e.target.value)}
                  className="input w-full"
                  disabled={fornecedoresLoading}
                >
                  <option value="">Todos os fornecedores</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nomeFantasia || fornecedor.razaoSocial}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Campo de Busca */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={selectedFornecedorId ? "Buscar endereços..." : "Selecione um fornecedor primeiro"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                    disabled={!selectedFornecedorId}
                  />
                </div>
              </div>
            </div>
          </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CEP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Carregando endereços...
                  </td>
                </tr>
              ) : paginatedEnderecos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {selectedFornecedorId ? 'Nenhum endereço encontrado' : 'Selecione um fornecedor para visualizar os endereços'}
                  </td>
                </tr>
              ) : (
                paginatedEnderecos.map((endereco) => (
                  <tr key={endereco.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">
                          {getFornecedorNome(endereco.fornecedorId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{endereco.logradouro}</div>
                        <div className="text-gray-500">
                          {endereco.numero && `${endereco.numero}, `}
                          {endereco.bairro && `${endereco.bairro}, `}
                          {endereco.municipio}/{endereco.uf}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCEP(endereco.cep)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <Eye className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="font-medium mb-1">Tipos de Endereço:</div>
                          <div className="space-y-1">
                            {endereco.tipo.map((tipo, index) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <DropdownMenu
                          items={[
                            {
                              label: 'Visualizar',
                              icon: <Eye className="dropdown-icon view" />,
                              onClick: () => console.log('Visualizar endereço', endereco)
                            },
                            {
                              label: 'Editar',
                              icon: <Edit className="dropdown-icon edit" />,
                              onClick: () => handleEditEndereco(endereco)
                            },
                            {
                              label: 'Excluir',
                              icon: <Trash2 className="dropdown-icon delete" />,
                              onClick: () => handleDeleteEndereco(endereco),
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
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredEnderecos.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

        </>
      ) : (
        /* Formulário de Endereço */
        <EnderecoFornecedorForm
          fornecedorId={selectedFornecedor?.id || editingEndereco?.fornecedorId || ''}
          fornecedorNome={selectedFornecedor?.nomeFantasia || selectedFornecedor?.razaoSocial || ''}
          onClose={handleCloseModal}
          onSuccess={handleEnderecoSuccess}
          enderecoToEdit={editingEndereco}
        />
      )}
    </div>
  );
};

export default EnderecosFornecedores;
