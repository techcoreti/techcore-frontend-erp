import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Phone, Eye, Users } from 'lucide-react';
import { useClientes } from '../hooks/useApi';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/api';
import ClienteForm from '../components/Forms/ClienteForm';
import DropdownMenu from '../components/DropdownMenu';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

const Clientes: React.FC = () => {
  const { 
    clientes, 
    loading, 
    error, 
    createCliente, 
    updateCliente, 
    deleteCliente,
    refresh 
  } = useClientes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);

  const filteredClientes = clientes.filter(cliente =>
    cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id);
        toast.success('Cliente excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir cliente');
      }
    }
  };

  const handleFormSubmit = async (data: CreateClienteDto | UpdateClienteDto) => {
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.id, data as UpdateClienteDto);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await createCliente(data as CreateClienteDto);
        toast.success('Cliente criado com sucesso!');
      }
      setShowForm(false);
      setEditingCliente(null);
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCliente(null);
  };

  const formatCPFCNPJ = (value: string) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <ClienteForm
          cliente={editingCliente}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-action add"
        >
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">NOVO</div>
        </button>
      </div>

			{paginatedClientes.length > 0 && (
			<>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF/CNPJ ou nome fantasia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="input"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>
			</div>
				
				{/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando clientes...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">Erro ao carregar clientes: {error}</p>
            <button onClick={refresh} className="btn btn-primary">
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF/CNPJ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.razaoSocial}
                          </div>
                          {cliente.nomeFantasia && (
                            <div className="text-sm text-gray-500">
                              {cliente.nomeFantasia}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.cpfCnpj ? formatCPFCNPJ(cliente.cpfCnpj) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cliente.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cliente.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <DropdownMenu
                          items={[
                            {
                              label: 'Visualizar',
                              icon: <Eye className="h-4 w-4" />,
                              onClick: () => {
                                // Implementar visualização
                                toast('Funcionalidade em desenvolvimento');
                              }
                            },
                            {
                              label: 'Editar',
                              icon: <Edit className="h-4 w-4" />,
                              onClick: () => handleEdit(cliente)
                            },
                            {
                              label: 'Endereços',
                              icon: <MapPin className="h-4 w-4" />,
                              onClick: () => {
                                // Implementar gestão de endereços
                                toast('Funcionalidade em desenvolvimento');
                              }
                            },
                            {
                              label: 'Contatos',
                              icon: <Phone className="h-4 w-4" />,
                              onClick: () => {
                                // Implementar gestão de contatos
                                toast('Funcionalidade em desenvolvimento');
                              }
                            },
                            {
                              label: 'Excluir',
                              icon: <Trash2 className="h-4 w-4" />,
                              onClick: () => handleDelete(cliente.id),
                              className: 'text-red-600 hover:text-red-800'
                            }
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredClientes.length}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </>
        )}
			</div>
				</>
			)}

      {/* Empty State */}
      {!loading && !error && paginatedClientes.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece cadastrando seu primeiro cliente'
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
          totalItems={filteredClientes.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
			)}
			
    </div>
  );
};

export default Clientes;