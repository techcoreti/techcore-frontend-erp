import React from 'react';
import { useForm } from 'react-hook-form';
import { Fornecedor } from '../../services/fornecedorService';

interface FornecedorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fornecedor: any) => void;
  fornecedor?: Fornecedor | null;
}

interface FornecedorFormData {
  razaoSocial: string;
  nomeFantasia?: string;
  cpfCnpj?: string;
  inscEstadual?: string;
  inscMunicipal?: string;
  tipoFornecimento: string[];
  ativo: boolean;
}

const FornecedorForm: React.FC<FornecedorFormProps> = ({ isOpen, onClose, onSave, fornecedor }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FornecedorFormData>({
    defaultValues: {
      razaoSocial: fornecedor?.razaoSocial || '',
      nomeFantasia: fornecedor?.nomeFantasia || '',
      cpfCnpj: fornecedor?.cpfCnpj || '',
      inscEstadual: fornecedor?.inscEstadual || '',
      inscMunicipal: '',
      tipoFornecimento: fornecedor?.tipoFornecimento || [],
      ativo: fornecedor?.ativo ?? true
    }
  });

  const watchedTipoFornecimento = watch('tipoFornecimento') || [];

  const handleTipoFornecimentoChange = (tipo: string, checked: boolean) => {
    const current = watchedTipoFornecimento;
    if (checked) {
      setValue('tipoFornecimento', [...current, tipo]);
    } else {
      setValue('tipoFornecimento', current.filter(t => t !== tipo));
    }
  };

  const onSubmit = (data: FornecedorFormData) => {
    // empresa_id é gerenciado pelo backend automaticamente
    const fornecedorData = {
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia,
      cpfCnpj: data.cpfCnpj,
      inscEstadual: data.inscEstadual,
      inscMunicipal: data.inscMunicipal,
      tipoFornecimento: data.tipoFornecimento,
      ativo: data.ativo
    };
    
    onSave(fornecedorData);
    reset();
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Informações do Fornecedor</h2>
            <p className="text-sm text-gray-600 mt-1">Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>
          </div>

          {/* Status do Fornecedor */}
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
                  <h3 className="text-sm font-medium text-gray-900">Status do Fornecedor</h3>
                  <p className="text-xs text-gray-500">Define se o fornecedor está ativo no sistema</p>
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

          {/* Campos do Formulário */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Razão Social */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Razão Social <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                {...register('razaoSocial', { required: 'Razão Social é obrigatória' })}
                type="text"
                placeholder="Empresa Exemplo Ltda."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.razaoSocial ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.razaoSocial && (
                <p className="mt-1 text-xs text-red-600">{errors.razaoSocial.message}</p>
              )}
            </div>

            {/* Nome Fantasia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Nome Fantasia <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                {...register('nomeFantasia')}
                type="text"
                placeholder="Exemplo Corp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* CPF/CNPJ, Inscrição Estadual e Municipal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    CPF/CNPJ <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  {...register('cpfCnpj')}
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Inscrição Estadual
                  </div>
                </label>
                <input
                  {...register('inscEstadual')}
                  type="text"
                  placeholder="000.000.000.000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Inscrição Municipal
                  </div>
                </label>
                <input
                  {...register('inscMunicipal')}
                  type="text"
                  placeholder="000000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Fornecimento */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tipo de Fornecimento</h3>
            <p className="text-xs text-gray-500 mb-4">Selecione o(s) tipo(s) de fornecimento</p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={watchedTipoFornecimento.includes('venda')}
                  onChange={(e) => handleTipoFornecimentoChange('venda', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm text-gray-900">
                  Venda
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={watchedTipoFornecimento.includes('servicos')}
                  onChange={(e) => handleTipoFornecimentoChange('servicos', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm text-gray-900">
                  Serviços
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={watchedTipoFornecimento.includes('ambos')}
                  onChange={(e) => handleTipoFornecimentoChange('ambos', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm text-gray-900">
                  Ambos (Venda e Serviços)
                </label>
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
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
            >
              {fornecedor ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FornecedorForm;