import React from 'react';
import { useForm } from 'react-hook-form';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../../types/api';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onSubmit: (data: CreateClienteDto | UpdateClienteDto) => void;
  onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateClienteDto>({
    defaultValues: cliente ? {
      razaoSocial: cliente.razaoSocial,
      nomeFantasia: cliente.nomeFantasia || '',
      cpfCnpj: cliente.cpfCnpj || '',
      inscEstadual: cliente.inscEstadual || '',
      inscMunicipal: cliente.inscMunicipal || '',
      ativo: cliente.ativo
    } : {
      razaoSocial: '',
      nomeFantasia: '',
      cpfCnpj: '',
      inscEstadual: '',
      inscMunicipal: '',
      ativo: true
    }
  });

  const cpfCnpjValue = watch('cpfCnpj');

  // Função para aplicar máscara do CPF/CNPJ
  const formatCPFCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    } else {
      // CNPJ: 00.000.000/0000-00
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  const handleCPFCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPFCNPJ(e.target.value);
    setValue('cpfCnpj', formattedValue);
  };

  const handleFormSubmit = (data: CreateClienteDto) => {
    // Remover máscara do CPF/CNPJ antes de enviar
    const submitData = {
      ...data,
      cpfCnpj: data.cpfCnpj?.replace(/\D/g, '')
    };
    onSubmit(submitData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Informações do Cliente</h2>
            <p className="text-sm text-gray-600 mt-1">Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>
          </div>

          {/* Status do Cliente */}
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
                  <h3 className="text-sm font-medium text-gray-900">Status do Cliente</h3>
                  <p className="text-xs text-gray-500">Define se o cliente está ativo no sistema</p>
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
                {...register('razaoSocial', { required: 'Razão social é obrigatória' })}
                type="text"
                placeholder="Digite a razão social"
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
                  Nome Fantasia
                </div>
              </label>
              <input
                {...register('nomeFantasia')}
                type="text"
                placeholder="Digite o nome fantasia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* CPF/CNPJ, Inscrição Estadual e Inscrição Municipal */}
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
                  {...register('cpfCnpj', { required: 'CPF/CNPJ é obrigatório' })}
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.cpfCnpj ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleCPFCNPJChange}
                  maxLength={18}
                />
                {errors.cpfCnpj && (
                  <p className="mt-1 text-xs text-red-600">{errors.cpfCnpj.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Inscrição Estadual
                  </div>
                </label>
                <input
                  {...register('inscEstadual')}
                  type="text"
                  placeholder="Digite a inscrição estadual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Inscrição Municipal
                  </div>
                </label>
                <input
                  {...register('inscMunicipal')}
                  type="text"
                  placeholder="Digite a inscrição municipal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            >
              {cliente ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;