import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Phone, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { contatoClienteService, ContatoCliente } from '../../services/contatoClienteService';

interface ContatoClienteFormData {
  nome: string;
  email?: string;
  telefone?: string;
  tipo: string[];
}

interface ContatoClienteFormProps {
  isOpen: boolean;
  clienteId: string;
  clienteNome: string;
  onClose: () => void;
  onSuccess?: () => void;
  contatoToEdit?: ContatoCliente | null; // Contato para edição
}

const ContatoClienteForm: React.FC<ContatoClienteFormProps> = ({ 
  isOpen,
  clienteId, 
  clienteNome, 
  onClose, 
  onSuccess,
  contatoToEdit = null
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedTipos, setSelectedTipos] = useState<string[]>(contatoToEdit?.tipo || ['comercial']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm<ContatoClienteFormData>({
    defaultValues: {
      tipo: contatoToEdit?.tipo || ['comercial'],
      nome: contatoToEdit?.nome || '',
      email: contatoToEdit?.email || '',
      telefone: contatoToEdit?.telefone || ''
    }
  });

  const tiposOptions = [
    { value: 'comercial', label: 'Comercial' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'administrativo', label: 'Administrativo' }
  ];

  const filteredTipos = tiposOptions.filter(tipo =>
    tipo.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTipoToggle = (tipoValue: string) => {
    const newSelectedTipos = selectedTipos.includes(tipoValue)
      ? selectedTipos.filter(t => t !== tipoValue)
      : [...selectedTipos, tipoValue];
    
    setSelectedTipos(newSelectedTipos);
    setValue('tipo', newSelectedTipos);
    
    // Limpar erro se selecionou pelo menos um tipo
    if (newSelectedTipos.length > 0) {
      clearErrors('tipo');
    }
  };

  const handleRemoveTipo = (tipoValue: string) => {
    const newSelectedTipos = selectedTipos.filter(t => t !== tipoValue);
    setSelectedTipos(newSelectedTipos);
    setValue('tipo', newSelectedTipos);
    
    // Limpar erro se ainda tem pelo menos um tipo selecionado
    if (newSelectedTipos.length > 0) {
      clearErrors('tipo');
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const removePhoneMask = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setValue('telefone', formattedValue);
  };

  const onSubmit = async (data: ContatoClienteFormData) => {
    // Validação manual para tipo de contato
    if (!selectedTipos || selectedTipos.length === 0) {
      setError('tipo', { 
        type: 'manual', 
        message: 'Selecione pelo menos um tipo de contato' 
      });
      return;
    }

    // Limpar erro se passou na validação
    clearErrors('tipo');

    setLoading(true);
    try {
      const contatoData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone ? removePhoneMask(data.telefone) : undefined,
        tipo: data.tipo
      };

      // Chamada para a API real
      if (contatoToEdit) {
        // Atualizar contato existente
        await contatoClienteService.updateContato(clienteId, contatoToEdit.id, contatoData);
      } else {
        // Criar novo contato
        await contatoClienteService.createContato(clienteId, contatoData);
      }
      
      toast.success(contatoToEdit ? 'Contato atualizado com sucesso!' : 'Contato cadastrado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar contato:', error);
      toast.error(error.message || 'Erro ao cadastrar contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {contatoToEdit ? 'Editar Contato' : 'Novo Contato'}
              </h1>
              <p className="text-xs text-gray-500">
                {contatoToEdit ? 'Atualize as informações do contato' : `Cadastre um novo contato para ${clienteNome}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Contato */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Tipo de Contato <span className="text-red-500">*</span></h3>
            <p className="text-xs text-gray-500">Selecione o(s) tipo(s) de contato</p>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <div 
              className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.tipo ? 'border-red-300' : 'border-gray-300'
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedTipos.length > 0 ? (
                  selectedTipos.map(tipo => {
                    const tipoLabel = tiposOptions.find(t => t.value === tipo)?.label;
                    return (
                      <span 
                        key={tipo}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                      >
                        {tipoLabel}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTipo(tipo);
                          }}
                          className="ml-1 hover:text-primary/80"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm">Selecione os tipos...</span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Buscar tipos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="max-h-40 overflow-y-auto">
                  {filteredTipos.map(tipo => (
                    <div
                      key={tipo.value}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTipoToggle(tipo.value)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3.5 h-3.5 border-2 rounded mr-2 flex items-center justify-center ${
                          selectedTipos.includes(tipo.value) 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {selectedTipos.includes(tipo.value) && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700">{tipo.label}</span>
                      </div>
                    </div>
                  ))}
                  {filteredTipos.length === 0 && (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      Nenhum tipo encontrado
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.tipo && (
            <p className="mt-1 text-xs text-red-600">{errors.tipo.message}</p>
          )}
        </div>

        {/* Informações do Contato */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Informações do Contato</h3>
            <p className="text-xs text-gray-500">Dados básicos do contato</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                placeholder="Nome completo do contato"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>
              )}
            </div>

            {/* Email e Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  type="email"
                  placeholder="email@exemplo.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  {...register('telefone')}
                  type="text"
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  onChange={handlePhoneChange}
                  maxLength={15}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (contatoToEdit ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContatoClienteForm;
