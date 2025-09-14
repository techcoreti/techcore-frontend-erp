import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Informações Básicas</h3>
            <p className="text-xs text-gray-500">Dados principais do cliente</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Razão Social */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Razão Social / Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register('razaoSocial', { required: 'Razão social é obrigatória' })}
                type="text"
                placeholder="Digite a razão social ou nome completo"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                  errors.razaoSocial ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.razaoSocial && (
                <p className="mt-1 text-xs text-red-600">{errors.razaoSocial.message}</p>
              )}
            </div>

            {/* Nome Fantasia */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nome Fantasia
              </label>
              <input
                {...register('nomeFantasia')}
                type="text"
                placeholder="Digite o nome fantasia (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Documentos e Registros */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Documentos e Registros</h3>
            <p className="text-xs text-gray-500">Informações fiscais e registros</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* CPF/CNPJ e Status */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  CPF/CNPJ
                </label>
                <input
                  {...register('cpfCnpj')}
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.cpfCnpj ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleCPFCNPJChange}
                  maxLength={18}
                />
                {errors.cpfCnpj && (
                  <p className="mt-1 text-xs text-red-600">{errors.cpfCnpj.message}</p>
                )}
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('ativo', { required: 'Status é obrigatório' })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm ${
                    errors.ativo ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
                {errors.ativo && (
                  <p className="mt-1 text-xs text-red-600">{errors.ativo.message}</p>
                )}
              </div>
            </div>

            {/* Inscrições */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Inscrição Estadual
                </label>
                <input
                  {...register('inscEstadual')}
                  type="text"
                  placeholder="Digite a inscrição estadual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Inscrição Municipal
                </label>
                <input
                  {...register('inscMunicipal')}
                  type="text"
                  placeholder="Digite a inscrição municipal"
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
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-sm"
          >
            {cliente ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;