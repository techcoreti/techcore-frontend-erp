import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';
import TipoPagamentoForm from '../../components/Forms/TipoPagamentoForm';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import { TipoPagamento } from '../../types';
import { tipoPagamentoService } from '../../services/tipoPagamentoService';

const TiposPagamento: React.FC = () => {
  const [tiposPagamento, setTiposPagamento] = useState<TipoPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Estados dos modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoPagamento | null>(null);
  const [actionType, setActionType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');

  // Carregar dados iniciais
  useEffect(() => {
    loadTiposPagamento();
  }, []);

  const loadTiposPagamento = async () => {
    try {
      setLoading(true);
      const response = await tipoPagamentoService.getAll();
      setTiposPagamento( response || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de pagamento:', error);
      toast.error('Erro ao carregar tipos de pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar dados localmente para busca
  const filteredTiposPagamento = tiposPagamento.filter(tipo =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredTiposPagamento.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTiposPagamento = filteredTiposPagamento.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handlers para ações CRUD
  const handleCreate = () => {
    setSelectedTipo(null);
    setActionType('create');
    setIsFormOpen(true);
  };

  const handleEdit = (tipo: TipoPagamento) => {
    setSelectedTipo(tipo);
    setActionType('edit');
    setIsFormOpen(true);
  };

  const handleView = (tipo: TipoPagamento) => {
    setSelectedTipo(tipo);
    setActionType('view');
    setIsFormOpen(true);
  };

  const handleDelete = (tipo: TipoPagamento) => {
    setSelectedTipo(tipo);
    setActionType('delete');
    setIsConfirmOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (actionType === 'create') {
        await tipoPagamentoService.create(data);
        toast.success('Tipo de pagamento criado com sucesso!');
      } else if (actionType === 'edit' && selectedTipo) {
        await tipoPagamentoService.update(selectedTipo.id, data);
        toast.success('Tipo de pagamento atualizado com sucesso!');
      }
      
      setIsFormOpen(false);
      loadTiposPagamento();
    } catch (error) {
      console.error('Erro ao salvar tipo de pagamento:', error);
      toast.error('Erro ao salvar tipo de pagamento');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTipo) return;

    try {
      await tipoPagamentoService.delete(selectedTipo.id);
      toast.success('Tipo de pagamento excluído com sucesso!');
      loadTiposPagamento();
    } catch (error) {
      console.error('Erro ao excluir tipo de pagamento:', error);
      toast.error('Erro ao excluir tipo de pagamento');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTipo(null);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedTipo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Pagamento</h1>
          <p className="text-gray-600">Gerencie os tipos de pagamento da empresa</p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn-action add"
        >
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
            placeholder="Buscar tipos de pagamento..."
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Pagamento
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTiposPagamento.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Nenhum tipo de pagamento encontrado</p>
                      <p className="text-sm">Comece criando um novo tipo de pagamento</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTiposPagamento.map((tipo) => (
                <tr key={tipo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {tipo.codigo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tipo.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => handleView(tipo)
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => handleEdit(tipo)
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => handleDelete(tipo),
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
        totalItems={filteredTiposPagamento.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modais */}
      <TipoPagamentoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        tipoPagamento={selectedTipo}
        mode={actionType === 'view' ? 'view' : actionType === 'edit' ? 'edit' : 'create'}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Excluir Tipo de Pagamento"
        message={`Tem certeza que deseja excluir o tipo de pagamento "${selectedTipo?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default TiposPagamento;
