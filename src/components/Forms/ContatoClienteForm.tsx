import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Phone, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { contatoClienteService, ContatoCliente } from '../../services/contatoClienteService';

interface ContatoClienteFormData {
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
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
      telefone: contatoToEdit?.telefone || '',
      whatsapp: contatoToEdit?.whatsapp || ''
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

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setValue('whatsapp', formattedValue);
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
        whatsapp: data.whatsapp ? removePhoneMask(data.whatsapp) : undefined,
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Informações do Contato</h2>
            <p className="text-sm text-gray-600 mt-1">Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>
            <p className="text-sm text-gray-500 mt-1">Cliente: {clienteNome}</p>
          </div>

          {/* Campos do Formulário */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Tipo de Contato */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Tipo de Contato</h3>
              <p className="text-xs text-gray-500 mb-1">Selecione o(s) tipo(s) de contato</p>
              
              <div className="relative" ref={dropdownRef}>
                <div 
                  className={`w-full px-4 py-3 border rounded-lg cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {tipoLabel}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTipo(tipo);
                              }}
                              className="ml-1 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
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
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Buscar tipos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                              selectedTipos.includes(tipo.value) 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'border-gray-300'
                            }`}>
                              {selectedTipos.includes(tipo.value) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700">{tipo.label}</span>
                          </div>
                        </div>
                      ))}
                      {filteredTipos.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
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

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nome <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                placeholder="Nome completo do contato"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone e WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    Telefone
                  </div>
                </label>
                <input
                  {...register('telefone')}
                  type="text"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={handlePhoneChange}
                  maxLength={15}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </div>
                </label>
                <input
                  {...register('whatsapp')}
                  type="text"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={handleWhatsAppChange}
                  maxLength={15}
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (contatoToEdit ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContatoClienteForm;