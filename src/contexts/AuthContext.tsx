import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginData, User, AuthContextType } from '../types';
import { authService } from '../services';
import apiService from '../services/api';
import { LoginDto, LoginResponse } from '../types/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiService.setAuthToken(token);
      } catch (err) {
        // Dados corrompidos, limpar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const loginRequest: LoginDto = {
        cnpj: data.cnpj,
        email: data.email,
        password: data.password
      };

      const response: LoginResponse = await authService.login(loginRequest);
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Configurar token no serviço de API
      apiService.setAuthToken(response.accessToken);
      
      setUser(response.user);
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remover token do serviço de API
    apiService.removeAuthToken();
    
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
