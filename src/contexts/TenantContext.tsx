import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

// Interface para empresa/tenant
export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

// Dados mockados da empresa
const EMPRESA_MOCK: Empresa = {
  id: '15454973-d9fd-46f8-b83c-8a3044f475f9',
  cnpj: '12.345.678/0001-90',
  razaoSocial: 'TechCore Sistemas LTDA',
  nomeFantasia: 'TechCore',
  email: 'contato@techcore.com.br',
  telefone: '(11) 99999-9999',
  ativo: true
};

interface TenantContextType {
  empresa: Empresa;
  setEmpresa: (empresa: Empresa) => void;
  empresaId: string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [empresa, setEmpresa] = useState<Empresa>(() => {
    // Tentar carregar dados do usuário autenticado
    const user = authService.getUser();
    if (user) {
      return {
        id: user.empresaId,
        cnpj: '12.345.678/0001-90', // Mock CNPJ - pode ser obtido via API se necessário
        razaoSocial: 'Empresa do Usuário', // Mock - pode ser obtido via API
        nomeFantasia: 'Empresa do Usuário',
        email: 'contato@empresa.com',
        telefone: '(11) 99999-9999',
        ativo: true
      };
    }
    
    // Fallback para mock se não houver usuário autenticado
    const savedEmpresa = localStorage.getItem('empresaId');
    if (savedEmpresa) {
      return { ...EMPRESA_MOCK, id: savedEmpresa };
    }
    return EMPRESA_MOCK;
  });

  // Atualizar empresa quando o usuário mudar
  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      const empresaData: Empresa = {
        id: user.empresaId,
        cnpj: '12.345.678/0001-90', // Mock CNPJ - pode ser obtido via API se necessário
        razaoSocial: 'Empresa do Usuário', // Mock - pode ser obtido via API
        nomeFantasia: 'Empresa do Usuário',
        email: 'contato@empresa.com',
        telefone: '(11) 99999-9999',
        ativo: true
      };
      setEmpresa(empresaData);
    }
  }, []);

  // Salvar empresa_id no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('empresaId', empresa.id);
  }, [empresa.id]);

  const value: TenantContextType = {
    empresa,
    setEmpresa,
    empresaId: empresa.id
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};

export default TenantContext;
