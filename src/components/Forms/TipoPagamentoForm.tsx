import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, CreditCard } from 'lucide-react';
import { TipoPagamento } from '../../types';

interface TipoPagamentoFormProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line 
  onSave: (data: any) => void;
  tipoPagamento?: TipoPagamento | null;
  mode?: 'create' | 'edit' | 'view';
}

interface TipoPagamentoFormData {
  codigo: string;
  nome: string;
}

const TipoPagamentoForm: React.FC<TipoPagamentoFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  tipoPagamento,
  mode = 'create'
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TipoPagamentoFormData>({
    defaultValues: {
      codigo: '',
      nome: ''
    }
  });

  // Resetar formulário quando tipoPagamento mudar
  useEffect(() => {
    if (tipoPagamento) {
      reset({
        codigo: tipoPagamento.codigo || '',
        nome: tipoPagamento.nome || ''
      });
    } else {
      reset({
        codigo: '',
        nome: ''
      });
    }
  }, [tipoPagamento, reset]);

  const onSubmit = (data: TipoPagamentoFormData) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Função para permitir apenas números no campo código
  const handleCodigoKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Novo Tipo de Pagamento' : 
               mode === 'edit' ? 'Editar Tipo de Pagamento' : 
               'Visualizar Tipo de Pagamento'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="form-group md:col-span-3">
                <label className="form-label-required">Código</label>
                <input
                  {...register('codigo', { 
                    required: 'Código é obrigatório',
                    minLength: {
                      value: 1,
                      message: 'Código deve ter pelo menos 1 caractere'
                    },
                    maxLength: {
                      value: 10,
                      message: 'Código deve ter no máximo 10 caracteres'
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Código deve conter apenas números'
                    }
                  })}
                  type="text"
                  placeholder="Ex: 1, 2, 3, etc."
                  className="form-input"
                  disabled={mode === 'view'}
                  onKeyPress={handleCodigoKeyPress}
                />
                {errors.codigo && (
                  <p className="form-error">{errors.codigo.message}</p>
                )}
              </div>

              <div className="form-group md:col-span-9">
                <label className="form-label-required">Nome</label>
                <input
                  {...register('nome', { 
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Nome deve ter no máximo 100 caracteres'
                    }
                  })}
                  type="text"
                  placeholder="Ex: Dinheiro, Cartão de Crédito, PIX, etc."
                  className="form-input"
                  disabled={mode === 'view'}
                />
                {errors.nome && (
                  <p className="form-error">{errors.nome.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn-modal btn-modal-danger"
            >
              <div className="icon-section">
                <X className="h-4 w-4" />
              </div>
              <div className="text-section">{mode === 'view' ? 'Fechar' : 'Cancelar'}</div>
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="btn-modal btn-modal-success"
              >
                <div className="icon-section">
                  <Save className="h-4 w-4" />
                </div>
                <div className="text-section">Salvar</div>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipoPagamentoForm;
