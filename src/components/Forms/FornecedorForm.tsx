import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Truck, Building2, Package } from 'lucide-react';
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

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Informações Básicas</h3>
            <p className="text-xs text-gray-500">Dados principais do fornecedor</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Razão Social */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Razão Social <span className="text-red-500">*</span>
              </label>
              <input
                {...register('razaoSocial', { required: 'Razão Social é obrigatória' })}
                type="text"
                placeholder="Digite a razão social"
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
                placeholder="Digite o nome fantasia"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    {...register('ativo')}
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Fornecedor ativo
                  </label>
                </div>
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

        {/* Tipo de Fornecimento */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Tipo de Fornecimento</h3>
            <p className="text-xs text-gray-500">Selecione o(s) tipo(s) de fornecimento</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={watchedTipoFornecimento.includes('venda')}
                onChange={(e) => handleTipoFornecimentoChange('venda', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Venda
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={watchedTipoFornecimento.includes('servicos')}
                onChange={(e) => handleTipoFornecimentoChange('servicos', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Serviços
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={watchedTipoFornecimento.includes('ambos')}
                onChange={(e) => handleTipoFornecimentoChange('ambos', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Ambos (Venda e Serviços)
              </label>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-sm"
          >
            {fornecedor ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FornecedorForm;
