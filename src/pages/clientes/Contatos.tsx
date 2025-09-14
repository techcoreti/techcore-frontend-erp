import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import ContatoClienteForm from '../../components/Forms/ContatoClienteForm';
import { useClientes } from '../../hooks/useClientes';
import { contatoClienteService, ContatoCliente } from '../../services/contatoClienteService';
import toast from 'react-hot-toast';

const ContatosClientes: React.FC = () => {
  const { clientes, loading: clientesLoading } = useClientes();

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
  const [contatos, setContatos] = useState<ContatoCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingContato, setEditingContato] = useState<ContatoCliente | null>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Função para buscar contatos de um cliente específico
  const fetchContatos = async (clienteId: string) => {

    if (!clienteId) return;
    
    setLoading(true);
    try {
			const contatosData = await contatoClienteService.getContatosByClienteId(clienteId);
      setContatos(contatosData);
    } catch (error: any) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter nome do cliente
  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? (cliente.nomeFantasia || cliente.nomeRazao) : 'Cliente não encontrado';
  };

  // Função para obter cliente selecionado
  const selectedCliente = clientes.find(c => c.id === selectedClienteId);

  // Filtrar contatos baseado no termo de busca
  const filteredContatos = contatos.filter(contato => {
    const clienteNome = getClienteNome(contato.clienteId);
    return clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (!selectedClienteId) {
      toast.error('Selecione um cliente primeiro');
      return;
    }
    setEditingContato(null);
    setShowModal(true);
  };

  const handleEditContato = (contato: ContatoCliente) => {
    setEditingContato(contato);
    setShowModal(true);
  };

  const handleDeleteContato = async (contato: ContatoCliente) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await contatoClienteService.deleteContato(contato.clienteId, contato.id);
        toast.success('Contato excluído com sucesso!');
        fetchContatos(selectedClienteId);
      } catch (error: any) {
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
    fetchContatos(selectedClienteId);
  };

  // Effect para buscar contatos quando o cliente selecionado mudar
  useEffect(() => {
    if (selectedClienteId) {
      fetchContatos(selectedClienteId);
    } else {
      setContatos([]);
    }
  }, [selectedClienteId]);

  return (
    <div className="space-y-6">
      {!showModal ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                Contatos de Clientes
              </h1>
              <p className="text-gray-600">Gerencie os contatos dos seus clientes</p>
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
                    placeholder={selectedClienteId ? "Buscar contatos..." : "Selecione um cliente primeiro"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                    disabled={!selectedClienteId}
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
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Carregando contatos...
                  </td>
                </tr>
              ) : paginatedContatos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {selectedClienteId ? 'Nenhum contato encontrado' : 'Selecione um cliente para visualizar os contatos'}
                  </td>
                </tr>
              ) : (
                paginatedContatos.map((contato) => (
                  <tr key={contato.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getClienteNome(contato.clienteId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contato.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {contato.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {contato.telefone ? formatPhone(contato.telefone) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 cursor-help transition-colors" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="font-medium mb-1">Tipos de Contato:</div>
                          <div className="space-y-1">
                            {contato.tipo.map((tipo, index) => (
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
        <ContatoClienteForm
          isOpen={showModal}
          clienteId={selectedCliente?.id || editingContato?.clienteId || ''}
          clienteNome={selectedCliente?.nomeFantasia || selectedCliente?.nomeRazao || ''}
          onClose={handleCloseModal}
          onSuccess={handleContatoSuccess}
          contatoToEdit={editingContato}
        />
      )}
    </div>
  );
};

export default ContatosClientes;
