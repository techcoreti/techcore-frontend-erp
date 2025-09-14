import React from 'react';
import { CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pagamentos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">Gerencie os tipos de pagamento e configurações financeiras</p>
        </div>
      </div>

      {/* Cards de navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tipos de Pagamento */}
        <Link 
          to="/pagamentos/tipos"
          className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Tipos de Pagamento
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cadastre e gerencie os tipos de pagamento
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </Link>

        {/* Placeholder para futuras funcionalidades */}
        <div className="card opacity-50">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  Relatórios de Pagamento
                </h3>
                <p className="text-sm text-gray-400">
                  Em breve
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card opacity-50">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  Configurações Financeiras
                </h3>
                <p className="text-sm text-gray-400">
                  Em breve
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sobre Pagamentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tipos de Pagamento</h4>
              <p className="text-sm text-gray-600">
                Configure os diferentes tipos de pagamento aceitos pela sua empresa, 
                como dinheiro, cartão de crédito, PIX, transferência bancária, etc.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Funcionalidades</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cadastro de tipos de pagamento</li>
                <li>• Códigos únicos para cada tipo</li>
                <li>• Gestão completa (CRUD)</li>
                <li>• Integração com vendas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagamentos;
