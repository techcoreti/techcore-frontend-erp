import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import ContatoFornecedorForm from '../../components/Forms/ContatoFornecedorForm';
import { useFornecedores } from '../../hooks/useFornecedores';
import { contatoFornecedorService, ContatoFornecedor } from '../../services/contatoFornecedorService';
import toast from 'react-hot-toast';

const ContatosFornecedores: React.FC = () => {
  const { fornecedores, loading: fornecedoresLoading } = useFornecedores();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const [contatos, setContatos] = useState<ContatoFornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingContato, setEditingContato] = useState<ContatoFornecedor | null>(null);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Verificar se há parâmetro de fornecedor na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fornecedorIdFromUrl = urlParams.get('fornecedor');
    
    if (fornecedorIdFromUrl && fornecedores.length > 0) {
      const fornecedor = fornecedores.find(f => f.id === fornecedorIdFromUrl);
      if (fornecedor) {
        setSelectedFornecedorId(fornecedorIdFromUrl);
        fetchContatos(fornecedorIdFromUrl);
      }
    }
  }, [fornecedores]);

  // Função para buscar contatos de um fornecedor específico
  const fetchContatos = async (fornecedorId: string) => {
    if (!fornecedorId) return;
    
    setLoading(true);
    try {
      const contatosData = await contatoFornecedorService.getContatosByFornecedorId(fornecedorId);
      setContatos(contatosData);
    } catch (error: unknown) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter nome do fornecedor
  const getFornecedorNome = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.razaoSocial : 'Fornecedor não encontrado';
  };

  // Função para obter fornecedor selecionado
  const selectedFornecedor = fornecedores.find(f => f.id === selectedFornecedorId);

  // Filtrar contatos baseado no termo de busca
  const filteredContatos = contatos.filter(contato => {
    const fornecedorNome = getFornecedorNome(contato.fornecedorId);
    return fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (contato.email && contato.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContatos = filteredContatos.slice(startIndex, endIndex);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleNovoContato = () => {
    if (!selectedFornecedorId) {
      toast.error('Selecione um fornecedor primeiro');
      return;
    }
    setEditingContato(null);
    setShowModal(true);
  };

  const handleEditContato = (contato: ContatoFornecedor) => {
    setEditingContato(contato);
    setShowModal(true);
  };

  const handleDeleteContato = async (contato: ContatoFornecedor) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await contatoFornecedorService.deleteContato(contato.fornecedorId, contato.id);
        toast.success('Contato excluído com sucesso!');
        fetchContatos(selectedFornecedorId);
      } catch (error: unknown) {
        console.error('Erro ao excluir contato:', error);
        toast.error('Erro ao excluir contato');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContato(null);
  };

  const handleContatoSuccess = () => {
    fetchContatos(selectedFornecedorId);
  };

  // Effect para buscar contatos quando o fornecedor selecionado mudar
  useEffect(() => {
    if (selectedFornecedorId) {
      fetchContatos(selectedFornecedorId);
    } else {
      setContatos([]);
    }
  }, [selectedFornecedorId]);

  return (
    <div className="space-y-6">
      {!showModal ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                Contatos de Fornecedores
              </h1>
              <p className="text-gray-600">Gerencie os contatos dos seus fornecedores</p>
            </div>
            <button onClick={handleNovoContato} className="btn-action add">
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
                      {fornecedor.razaoSocial}
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
                    placeholder={selectedFornecedorId ? "Buscar contatos..." : "Selecione um fornecedor primeiro"}
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
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Carregando contatos...
                  </td>
                </tr>
              ) : paginatedContatos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {selectedFornecedorId ? 'Nenhum contato encontrado' : 'Selecione um fornecedor para visualizar os contatos'}
                  </td>
                </tr>
              ) : (
                paginatedContatos.map((contato) => (
                  <tr key={contato.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contato.nome}
                        </div>
                        {contato.email && (
                          <div className="text-sm text-gray-500">
                            {contato.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {contato.telefone ? formatPhone(contato.telefone) : '-'}
                        </div>
                        {contato.whatsapp && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            {formatPhone(contato.whatsapp)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 cursor-help transition-colors" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="font-medium mb-1">Tipos de Contato:</div>
                          <div className="space-y-1">
                            {contato.tipo.map((tipo: string, index: number) => (
                              <div key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
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
                        !contato.deleted_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {!contato.deleted_at ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <DropdownMenu
                          items={[
                            {
                              label: 'Visualizar',
                              icon: <Eye className="dropdown-icon view" />,
                              onClick: () => console.log('Visualizar contato', contato)
                            },
                            {
                              label: 'Editar',
                              icon: <Edit className="dropdown-icon edit" />,
                              onClick: () => handleEditContato(contato)
                            },
                            {
                              label: 'Excluir',
                              icon: <Trash2 className="dropdown-icon delete" />,
                              onClick: () => handleDeleteContato(contato),
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
        totalItems={filteredContatos.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

        </>
      ) : (
        /* Formulário de Contato */
        <ContatoFornecedorForm
          isOpen={showModal}
          fornecedorId={selectedFornecedor?.id || editingContato?.fornecedorId || ''}
          fornecedorNome={selectedFornecedor?.razaoSocial || ''}
          onClose={handleCloseModal}
          onSuccess={handleContatoSuccess}
          contatoToEdit={editingContato}
        />
      )}
    </div>
  );
};

export default ContatosFornecedores;