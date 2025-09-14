import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Building2, User, Lock } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { LoginData } from '../types';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthContext();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginData>();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Função para aplicar máscara do CNPJ
  const formatCNPJ = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara: 00.000.000/0000-00
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    } else if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  // Função para remover máscara do CNPJ
  const removeCNPJMask = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNPJ(e.target.value);
    setValue('cnpj', formattedValue);
  };

  const onSubmit = async (data: LoginData) => {
    // Remove a máscara do CNPJ antes de enviar
    const loginData = {
      ...data,
      cnpj: removeCNPJMask(data.cnpj)
    };
    
    const success = await login(loginData);
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } else {
      toast.error('CNPJ, usuário ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            TechCore Retaguarda
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema Multi-tenant de Gestão
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ da Empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('cnpj', { 
                    required: 'CNPJ é obrigatório',
                    pattern: {
                      value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                      message: 'CNPJ deve estar no formato 00.000.000/0000-00'
                    }
                  })}
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="input pl-10 w-full"
                  onChange={handleCNPJChange}
                  maxLength={18}
                />
              </div>
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email deve ter um formato válido'
                    }
                  })}
                  type="email"
                  placeholder="Digite seu email"
                  className="input pl-10 w-full"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', { required: 'Senha é obrigatória' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  className="input pl-10 pr-10 w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
