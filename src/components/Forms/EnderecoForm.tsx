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

  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm<EnderecoFormData>({

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
      uf: enderecoToEdit?.uf || ''
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
		debugger;
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
        tipo: data.tipo
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
    <div className="max-w-4xl mx-auto">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Endereço */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Tipo de Endereço <span className="text-red-500">*</span></h3>
            <p className="text-xs text-gray-500">Selecione o(s) tipo(s) de endereço</p>
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
        </div>

        {/* Informações do Endereço */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Informações do Endereço</h3>
            <p className="text-xs text-gray-500">Dados básicos do endereço</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* CEP, Logradouro e Número */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  CEP <span className="text-red-500">*</span>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.cep ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleCEPChange}
                  maxLength={9}
                />
              </div>
              <div className="md:col-span-8">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Logradouro <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('logradouro', { required: 'Logradouro é obrigatório' })}
                  type="text"
                  placeholder="Rua, Avenida, etc."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.logradouro ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('numero', { required: 'Número é obrigatório' })}
                  type="text"
                  placeholder="12345"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.numero ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                {...register('complemento')}
                type="text"
                placeholder="Apartamento, sala, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Localização</h3>
            <p className="text-xs text-gray-500">Informações de localização geográfica</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Bairro, Município e Código do Município */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bairro <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('bairro', { required: 'Bairro é obrigatório' })}
                  type="text"
                  placeholder="Nome do bairro"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.bairro ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Município <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('municipio', { required: 'Município é obrigatório' })}
                  type="text"
                  placeholder="Nome do município"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.municipio ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cod. Município
                </label>
                <input
                  {...register('municipioCodigo', { required: 'Código do município é obrigatório' })}
                  type="text"
                  placeholder="Ex: 3550308"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.municipioCodigo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* UF, Código da UF e País */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  UF <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('uf', { required: 'UF é obrigatória' })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.uf ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione a UF</option>
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
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Código da UF
                </label>
                <input
                  {...register('ufCodigo', { required: 'Código da UF é obrigatório' })}
                  type="text"
                  placeholder="Ex: 35"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.ufCodigo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  País <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('pais', { required: 'País é obrigatório' })}
                  type="text"
                  placeholder="Nome do país"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Código do País
                </label>
                <input
                  {...register('paisCodigo', { required: 'Código do país é obrigatório' })}
                  type="text"
                  placeholder="Ex: 1058"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
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
            {loading ? 'Salvando...' : (enderecoToEdit ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnderecoForm;
