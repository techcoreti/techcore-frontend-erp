import React from 'react';
import { Menu, Bell, User, LogOut, Building2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import ApiStatus from '../ApiStatus';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthContext();
  const { empresa } = useTenant();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-4 lg:ml-0">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                    {empresa.nomeFantasia || empresa.razaoSocial}
                  </h1>
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    CNPJ: {empresa.cnpj}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* API Status */}
            <ApiStatus />
            
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nome}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.tipoUsuario}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
