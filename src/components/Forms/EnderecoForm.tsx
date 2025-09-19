import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { enderecoClienteService, EnderecoCliente } from '../../services/enderecoClienteService';

interface EnderecoFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  municipioCodigo: string;
  uf: string;
  ufCodigo: string;
  pais: string;
  paisCodigo: string;
  tipo: string[];
  ativo: boolean;
}

interface EnderecoFormProps {
  clienteId: string;
  clienteNome: string;
  onClose: () => void;
  onSuccess?: () => void;
  enderecoToEdit?: EnderecoCliente | null; // Endereço para edição
}

const EnderecoForm: React.FC<EnderecoFormProps> = ({ 
  clienteId, 
  onClose, 
  onSuccess,
  enderecoToEdit = null
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedTipos, setSelectedTipos] = useState<string[]>(enderecoToEdit?.tipo || ['comercial']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  };

  const { register, handleSubmit, formState: { errors }, setValue, setError, reset, watch } = useForm<EnderecoFormData>({
    defaultValues: {
      tipo: enderecoToEdit?.tipo || ['comercial'],
      pais: enderecoToEdit?.pais || 'Brasil',
      paisCodigo: enderecoToEdit?.paisCodigo || '1058',
      municipioCodigo: enderecoToEdit?.municipioCodigo || '',
      ufCodigo: enderecoToEdit?.ufCodigo || '',
      cep: enderecoToEdit?.cep ? formatCEP(enderecoToEdit.cep) : '',
      logradouro: enderecoToEdit?.logradouro || '',
      numero: enderecoToEdit?.numero || '',
      complemento: enderecoToEdit?.complemento || '',
      bairro: enderecoToEdit?.bairro || '',
      municipio: enderecoToEdit?.municipio || '',
      uf: enderecoToEdit?.uf || '',
      ativo: (enderecoToEdit as any)?.ativo ?? true
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
      setError('tipo', { type: 'manual', message: '' });
    }
  };

  const handleRemoveTipo = (tipoValue: string) => {
    const newSelectedTipos = selectedTipos.filter(t => t !== tipoValue);
    setSelectedTipos(newSelectedTipos);
    setValue('tipo', newSelectedTipos);
    
    // Limpar erro se ainda tem pelo menos um tipo selecionado
    if (newSelectedTipos.length > 0) {
      setError('tipo', { type: 'manual', message: '' });
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

  const removeCEPMask = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    setValue('cep', formattedValue);
  };

  const onSubmit = async (data: EnderecoFormData) => {
    // Validação manual para tipo de endereço
    if (!selectedTipos || selectedTipos.length === 0) {
      setError('tipo', { 
        type: 'manual', 
        message: 'Selecione pelo menos um tipo de endereço' 
      });
      setLoading(false);
      return;
    }

    // Limpar erro se passou na validação
    if (errors.tipo) {
      setError('tipo', { type: 'manual', message: '' });
    }

    setLoading(true);
    try {
      const enderecoData = {
        cep: removeCEPMask(data.cep),
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        municipioCodigo: data.municipioCodigo,
        uf: data.uf,
        ufCodigo: data.ufCodigo,
        pais: data.pais,
        paisCodigo: data.paisCodigo,
        tipo: data.tipo,
        ativo: data.ativo
      };

      // Chamada para a API real
      if (enderecoToEdit) {
        // Atualizar endereço existente
        await enderecoClienteService.updateEndereco(clienteId, enderecoToEdit.id, enderecoData);
      } else {
        // Criar novo endereço
        await enderecoClienteService.createEndereco(clienteId, enderecoData);
      }
      
      toast.success(enderecoToEdit ? 'Endereço atualizado com sucesso!' : 'Endereço cadastrado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      console.error('Erro ao cadastrar endereço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar endereço. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[50rem] mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Informações do Endereço</h2>
            <p className="text-sm text-gray-600 mt-1">Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>
          </div>

          {/* Status do Endereço do Fornecedor */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Status do Endereço do Cliente</h3>
                  <p className="text-xs text-gray-500">Define se o endereço do cliente está ativo no sistema</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setValue('ativo', !watch('ativo'))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    watch('ativo') ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      watch('ativo') ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {watch('ativo') ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
					</div>
					
          {/* Tipo de Endereço */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Tipo de Endereço</h3>
            <p className="text-xs text-gray-500 mb-1">Selecione o(s) tipo(s) de endereço</p>
            
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

          {/* Campos do Formulário */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* CEP, Logradouro e Número */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    CEP <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('cep', {
                    required: 'CEP é obrigatório',
                    pattern: {
                      value: /^\d{5}-\d{3}$/,
                      message: 'CEP deve estar no formato 00000-000'
                    }
                  })}
                  type="text"
                  placeholder="00000-000"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.cep ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleCEPChange}
                  maxLength={9}
                />
                {errors.cep && (
                  <p className="mt-1 text-xs text-red-600">{errors.cep.message}</p>
                )}
              </div>
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Logradouro <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('logradouro', { required: 'Logradouro é obrigatório' })}
                  type="text"
                  placeholder="Rua, Avenida, etc."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.logradouro ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.logradouro && (
                  <p className="mt-1 text-xs text-red-600">{errors.logradouro.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Número <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('numero', { required: 'Número é obrigatório' })}
                  type="text"
                  placeholder="12345"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.numero ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.numero && (
                  <p className="mt-1 text-xs text-red-600">{errors.numero.message}</p>
                )}
              </div>
            </div>

            {/* Complemento e Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Complemento
                  </div>
                </label>
                <input
                  {...register('complemento')}
                  type="text"
                  placeholder="Apartamento, sala, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Bairro <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('bairro', { required: 'Bairro é obrigatório' })}
                  type="text"
                  placeholder="Nome do bairro"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.bairro ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.bairro && (
                  <p className="mt-1 text-xs text-red-600">{errors.bairro.message}</p>
                )}
              </div>
            </div>

            {/* Município, Código Município, UF e Código UF */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Município <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('municipio', { required: 'Município é obrigatório' })}
                  type="text"
                  placeholder="Nome do município"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.municipio ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.municipio && (
                  <p className="mt-1 text-xs text-red-600">{errors.municipio.message}</p>
                )}
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Cód. Município <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('municipioCodigo', { required: 'Código do município é obrigatório' })}
                  type="text"
                  placeholder="3550308"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.municipioCodigo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.municipioCodigo && (
                  <p className="mt-1 text-xs text-red-600">{errors.municipioCodigo.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    UF <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  {...register('uf', { required: 'UF é obrigatória' })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.uf ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
                {errors.uf && (
                  <p className="mt-1 text-xs text-red-600">{errors.uf.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    UF Código <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('ufCodigo', { required: 'Código do estado é obrigatório' })}
                  type="text"
                  placeholder="35"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.ufCodigo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ufCodigo && (
                  <p className="mt-1 text-xs text-red-600">{errors.ufCodigo.message}</p>
                )}
              </div>
            </div>

            {/* País e Código do País */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    País <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('pais', { required: 'País é obrigatório' })}
                  type="text"
                  placeholder="Brasil"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.pais ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.pais && (
                  <p className="mt-1 text-xs text-red-600">{errors.pais.message}</p>
                )}
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Cód. País <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('paisCodigo', { required: 'Código do país é obrigatório' })}
                  type="text"
                  placeholder="1058"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.paisCodigo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.paisCodigo && (
                  <p className="mt-1 text-xs text-red-600">{errors.paisCodigo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (enderecoToEdit ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnderecoForm;
