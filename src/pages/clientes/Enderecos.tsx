import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Eye, MapPin, Plus } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import EnderecoForm from '../../components/Forms/EnderecoForm';
import { useClientes } from '../../hooks/useClientes';
import { enderecoClienteService, EnderecoCliente } from '../../services/enderecoClienteService';
import { Cliente } from '../../services/clienteService';
import toast from 'react-hot-toast';

const EnderecosClientes: React.FC = () => {
  const { clientes, loading: clientesLoading } = useClientes();
  const [enderecos, setEnderecos] = useState<EnderecoCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editingEndereco, setEditingEndereco] = useState<EnderecoCliente | null>(null);

  // Função para formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  };

  // Verificar se há parâmetro de cliente na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteIdFromUrl = urlParams.get('cliente');
    
    if (clienteIdFromUrl && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === clienteIdFromUrl);
      if (cliente) {
        setSelectedClienteId(clienteIdFromUrl);
        setSelectedCliente(cliente);
        fetchEnderecos(clienteIdFromUrl);
      }
    }
  }, [clientes]);

  // Função para buscar endereços por cliente específico
  const fetchEnderecos = async (clienteId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar endereços de um cliente específico
      const enderecosCliente = await enderecoClienteService.getEnderecosByClienteId(clienteId);
      setEnderecos(enderecosCliente);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao carregar endereços');
        console.error('Erro ao carregar endereços:', err);
      } else {
        setError('Erro ao carregar endereços');
        console.error('Erro ao carregar endereços:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Não carregar endereços automaticamente - só após seleção do cliente

  // Carregar endereços quando o cliente selecionado mudar
  useEffect(() => {
    if (selectedClienteId) {
      fetchEnderecos(selectedClienteId);
    } else {
      // Limpar endereços e termo de busca quando nenhum cliente estiver selecionado
      setEnderecos([]);
      setSearchTerm('');
    }
  }, [selectedClienteId]);

  const filteredEnderecos = enderecos.filter(endereco => {
    const matchesSearch = endereco.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endereco.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endereco.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endereco.cep.includes(searchTerm);
    
    return matchesSearch;
  });

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredEnderecos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnderecos = filteredEnderecos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleNovoEndereco = () => {
    if (!selectedClienteId) {
      toast.error('Selecione um cliente primeiro');
      return;
    }
    
    const cliente = clientes.find(c => c.id === selectedClienteId);
    if (cliente) {
      setSelectedCliente(cliente);
      setEditingEndereco(null);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setEditingEndereco(null);
  };

  const handleEnderecoSuccess = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setEditingEndereco(null);
    
    // Recarregar endereços se um cliente estiver selecionado
    if (selectedClienteId) {
      fetchEnderecos(selectedClienteId);
    }
    
    toast.success(editingEndereco ? 'Endereço atualizado com sucesso!' : 'Endereço criado com sucesso!');
  };

  const handleEditEndereco = (endereco: EnderecoCliente) => {
    const cliente = clientes.find(c => c.id === endereco.clienteId);
    setSelectedCliente(cliente || null);
    setEditingEndereco(endereco);
    setShowModal(true);
  };

  const handleDeleteEndereco = async (endereco: EnderecoCliente) => {
    if (window.confirm(`Tem certeza que deseja excluir este endereço?\n\n${endereco.logradouro}, ${endereco.numero} - ${endereco.municipio}/${endereco.uf}`)) {
      try {
        await enderecoClienteService.deleteEndereco(endereco.clienteId, endereco.id);
        toast.success('Endereço excluído com sucesso!');
        // Recarregar a lista de endereços
        fetchEnderecos(selectedClienteId);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Erro ao excluir endereço. Tente novamente.');
        } else {
          toast.error('Erro ao excluir endereço. Tente novamente.');
        }
      }
    }
  };


  return (
    <div className="space-y-6">
      {!showModal ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Endereços de Clientes
              </h1>
              <p className="text-gray-600">Gerencie os endereços dos seus clientes</p>
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
          {/* Select de Clientes */}
          <div>
            <select
              value={selectedClienteId}
              onChange={(e) => setSelectedClienteId(e.target.value)}
              className="input w-full"
              disabled={clientesLoading}
            >
              <option value="">Todos os clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nomeFantasia || cliente.nomeRazao}
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
                placeholder={selectedClienteId ? "Buscar endereços..." : "Selecione um cliente primeiro"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
                disabled={!selectedClienteId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Endereços */}
      {/* Lista de Endereços */}
      <div className="card p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando endereços...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => selectedClienteId && fetchEnderecos(selectedClienteId)}
              className="btn-action add"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && enderecos.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {selectedClienteId 
                ? 'Nenhum endereço encontrado para este cliente' 
                : 'Selecione um cliente para visualizar os endereços'
              }
            </p>
          </div>
        )}

        {!loading && !error && filteredEnderecos.length > 0 && (
          <>
            <div className="overflow-x-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CEP
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedEnderecos.map((endereco) => {
                    const cliente = clientes.find(c => c.id === endereco.clienteId);
                    return (
                      <tr key={endereco.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {cliente?.nomeFantasia || cliente?.nomeRazao || 'Cliente não encontrado'}
                            </div>
                          </div>
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
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {endereco.logradouro}, {endereco.numero}
                            {endereco.complemento && ` - ${endereco.complemento}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {endereco.bairro} - {endereco.municipio}/{endereco.uf}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCEP(endereco.cep)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu
                            items={[
                              {
                                label: 'Visualizar',
                                icon: <Eye className="h-4 w-4" />,
                                onClick: () => console.log('Visualizar endereço')
                              },
                              {
                                label: 'Editar',
                                icon: <Edit className="h-4 w-4" />,
                                onClick: () => handleEditEndereco(endereco)
                              },
                              {
                                label: 'Excluir',
                                icon: <Trash2 className="h-4 w-4" />,
                                onClick: () => handleDeleteEndereco(endereco),
                                destructive: true
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
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
        <EnderecoForm
          clienteId={selectedCliente?.id || editingEndereco?.clienteId || ''}
          clienteNome={selectedCliente?.nomeFantasia || selectedCliente?.nomeRazao || ''}
          onClose={handleCloseModal}
          onSuccess={handleEnderecoSuccess}
          enderecoToEdit={editingEndereco}
        />
      )}
    </div>
  );
};

export default EnderecosClientes;
