import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Package } from 'lucide-react';
import { EstoqueTipo } from '../../types';

interface EstoqueTipoFormProps {
  isOpen: boolean;
	onClose: () => void;
	// eslint-disable-next-line 
  onSave: (data:any) => void;
  tipoEstoque?: EstoqueTipo | null;
  mode?: 'create' | 'edit' | 'view';
}

interface EstoqueTipoFormData {
  nome: string;
  descricao?: string;
}

const EstoqueTipoForm: React.FC<EstoqueTipoFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  tipoEstoque,
  mode = 'create'
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EstoqueTipoFormData>({
    defaultValues: {
      nome: '',
      descricao: ''
    }
  });

  // Resetar formulário quando tipoEstoque mudar
  useEffect(() => {
    if (tipoEstoque) {
      reset({
        nome: tipoEstoque.nome || '',
        descricao: tipoEstoque.descricao || ''
      });
    } else {
      reset({
        nome: '',
        descricao: ''
      });
    }
  }, [tipoEstoque, reset]);

  const onSubmit = (data: EstoqueTipoFormData) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Novo Tipo de Estoque' : 
               mode === 'edit' ? 'Editar Tipo de Estoque' : 
               'Visualizar Tipo de Estoque'}
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
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label-required">Nome do Tipo de Estoque</label>
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
                  placeholder="Ex: Estoque Principal, Matéria-Prima, etc."
                  className="form-input"
                  disabled={mode === 'view'}
                />
                {errors.nome && (
                  <p className="form-error">{errors.nome.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  {...register('descricao', {
                    maxLength: {
                      value: 500,
                      message: 'Descrição deve ter no máximo 500 caracteres'
                    }
                  })}
                  placeholder="Descreva o propósito deste tipo de estoque..."
                  rows={4}
                  className="form-input resize-none"
                  disabled={mode === 'view'}
                />
                {errors.descricao && (
                  <p className="form-error">{errors.descricao.message}</p>
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

export default EstoqueTipoForm;
