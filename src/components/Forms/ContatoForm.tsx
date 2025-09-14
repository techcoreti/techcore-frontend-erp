import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContatoFormData {
  tipo_contato: string;
  valor: string;
  principal: boolean;
  observacoes?: string;
}

interface ContatoFormProps {
  clienteId: string;
  clienteNome: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ContatoForm: React.FC<ContatoFormProps> = ({ 
  clienteId, 
  clienteNome, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ContatoFormData>({
    defaultValues: {
      tipo_contato: 'TELEFONE',
      principal: false
    }
  });

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

  const formatEmail = (value: string) => {
    return value.toLowerCase().trim();
  };

  const removePhoneMask = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tipoContato = watch('tipo_contato');
    const value = e.target.value;
    
    if (tipoContato === 'TELEFONE' || tipoContato === 'CELULAR') {
      const formattedValue = formatPhone(value);
      setValue('valor', formattedValue);
    } else if (tipoContato === 'EMAIL') {
      const formattedValue = formatEmail(value);
      setValue('valor', formattedValue);
    } else {
      setValue('valor', value);
    }
  };

  const onSubmit = async (data: ContatoFormData) => {
    setLoading(true);
    try {
      const contatoData = {
        ...data,
        valor: data.tipo_contato === 'TELEFONE' || data.tipo_contato === 'CELULAR' 
          ? removePhoneMask(data.valor) 
          : data.valor,
        cliente_id: clienteId
      };

      // Aqui você faria a chamada para a API
      console.log('Dados do contato:', contatoData);
      
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Contato cadastrado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar contato:', error);
      toast.error('Erro ao cadastrar contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const tipoContato = watch('tipo_contato');

  const getPlaceholder = () => {
    switch (tipoContato) {
      case 'TELEFONE':
        return '(11) 1234-5678';
      case 'CELULAR':
        return '(11) 99999-9999';
      case 'EMAIL':
        return 'email@exemplo.com';
      case 'WHATSAPP':
        return '(11) 99999-9999';
      default:
        return 'Digite o valor';
    }
  };

  const getValidationRules = () => {
    switch (tipoContato) {
      case 'TELEFONE':
        return {
          required: 'Telefone é obrigatório',
          pattern: {
            value: /^\(\d{2}\) \d{4}-\d{4}$/,
            message: 'Telefone deve estar no formato (11) 1234-5678'
          }
        };
      case 'CELULAR':
        return {
          required: 'Celular é obrigatório',
          pattern: {
            value: /^\(\d{2}\) \d{5}-\d{4}$/,
            message: 'Celular deve estar no formato (11) 99999-9999'
          }
        };
      case 'EMAIL':
        return {
          required: 'Email é obrigatório',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email deve ter um formato válido'
          }
        };
      case 'WHATSAPP':
        return {
          required: 'WhatsApp é obrigatório',
          pattern: {
            value: /^\(\d{2}\) \d{5}-\d{4}$/,
            message: 'WhatsApp deve estar no formato (11) 99999-9999'
          }
        };
      default:
        return {
          required: 'Valor é obrigatório'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg mr-3">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Novo Contato</h2>
              <p className="text-sm text-gray-600">Cliente: {clienteNome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Tipo de Contato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contato *
            </label>
            <select
              {...register('tipo_contato', { required: 'Tipo de contato é obrigatório' })}
              className="input w-full"
            >
              <option value="TELEFONE">Telefone</option>
              <option value="CELULAR">Celular</option>
              <option value="EMAIL">Email</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="FAX">Fax</option>
              <option value="OUTRO">Outro</option>
            </select>
            {errors.tipo_contato && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo_contato.message}</p>
            )}
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tipoContato === 'EMAIL' ? 'Email' : 
               tipoContato === 'TELEFONE' ? 'Telefone' :
               tipoContato === 'CELULAR' ? 'Celular' :
               tipoContato === 'WHATSAPP' ? 'WhatsApp' :
               tipoContato === 'FAX' ? 'Fax' : 'Valor'} *
            </label>
            <input
              {...register('valor', getValidationRules())}
              type={tipoContato === 'EMAIL' ? 'email' : 'text'}
              placeholder={getPlaceholder()}
              className="input w-full"
              onChange={handleValorChange}
              maxLength={tipoContato === 'EMAIL' ? 100 : 
                         tipoContato === 'TELEFONE' ? 15 :
                         tipoContato === 'CELULAR' || tipoContato === 'WHATSAPP' ? 16 : 50}
            />
            {errors.valor && (
              <p className="text-red-500 text-sm mt-1">{errors.valor.message}</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              {...register('observacoes')}
              rows={3}
              placeholder="Observações adicionais sobre o contato..."
              className="input w-full resize-none"
            />
          </div>

          {/* Principal */}
          <div className="flex items-center">
            <input
              {...register('principal')}
              type="checkbox"
              id="principal"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="principal" className="ml-2 block text-sm text-gray-700">
              Contato principal
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-modal bg-gray-500 hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContatoForm;
