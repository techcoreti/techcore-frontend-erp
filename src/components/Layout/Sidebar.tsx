import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Truck, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  FileText,
  X,
  Building2,
  ChevronDown,
  ChevronRight,
  Package2,
  Layers,
  Settings,
  CreditCard
} from 'lucide-react';
import { MenuItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: Users,
    path: '/clientes',
    children: [
      {
        id: 'meus-clientes',
        label: 'Meus Clientes',
        icon: Users,
        path: '/clientes'
      },
      {
        id: 'enderecos-clientes',
        label: 'Endereços',
        icon: Settings,
        path: '/clientes/enderecos'
      },
      {
        id: 'contatos-clientes',
        label: 'Contatos',
        icon: Settings,
        path: '/clientes/contatos'
      }
    ]
  },
  {
    id: 'fornecedores',
    label: 'Fornecedores',
    icon: Truck,
    path: '/fornecedores',
    children: [
      {
        id: 'meus-fornecedores',
        label: 'Meus Fornecedores',
        icon: Truck,
        path: '/fornecedores'
      },
      {
        id: 'enderecos-fornecedores',
        label: 'Endereços',
        icon: Settings,
        path: '/fornecedores/enderecos'
      },
      {
        id: 'contatos-fornecedores',
        label: 'Contatos',
        icon: Settings,
        path: '/fornecedores/contatos'
      }
    ]
  },
  {
    id: 'produtos',
    label: 'Produtos',
    icon: Package,
    path: '/produtos',
    children: [
      {
        id: 'meus-produtos',
        label: 'Meus Produtos',
        icon: Package2,
        path: '/produtos'
      },
      {
        id: 'categorias',
        label: 'Categorias',
        icon: Layers,
        path: '/produtos/categorias'
      },
      {
        id: 'tipos-produto',
        label: 'Tipos de Produto',
        icon: Settings,
        path: '/produtos/tipos'
      },
      {
        id: 'marcas-produto',
        label: 'Marcas',
        icon: Package2,
        path: '/produtos/marcas'
      }
    ]
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: BarChart3,
    path: '/estoque',
    children: [
      {
        id: 'controle-estoque',
        label: 'Controle de Estoque',
        icon: BarChart3,
        path: '/estoque'
      },
      {
        id: 'movimentacoes',
        label: 'Movimentações',
        icon: BarChart3,
        path: '/estoque/movimentacoes'
      },
      {
        id: 'tipos-estoque',
        label: 'Tipos de Estoque',
        icon: Settings,
        path: '/estoque/tipos'
      },
      {
        id: 'grades',
        label: 'Grades',
        icon: Settings,
        path: '/estoque/grades'
      }
    ]
  },
  {
    id: 'pagamentos',
    label: 'Pagamentos',
    icon: CreditCard,
    path: '/pagamentos',
    children: [
      {
        id: 'tipos-pagamento',
        label: 'Tipos de Pagamento',
        icon: CreditCard,
        path: '/pagamentos/tipos'
      }
    ]
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: ShoppingCart,
    path: '/vendas',
    children: [
      {
        id: 'minhas-vendas',
        label: 'Minhas Vendas',
        icon: ShoppingCart,
        path: '/vendas'
      },
      {
        id: 'nova-venda',
        label: 'Nova Venda',
        icon: ShoppingCart,
        path: '/vendas/nova'
      }
    ]
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileText,
    path: '/relatorios'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const isActiveMenu = (item: MenuItem) => {
    if (item.path === location.pathname) return true;
    if (item.children) {
      return item.children.some(child => child.path === location.pathname);
    }
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TechCore</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveMenu(item);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = isMenuExpanded(item.id);
              
              return (
                <div key={item.id}>
                  {/* Menu Principal */}
                  <div
                    className={`
                      group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.id);
                      } else {
                        // Navegar para a página se não tiver filhos
                        navigate(item.path);
                        onClose();
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                      `} />
                      {item.label}
                    </div>
                    {hasChildren && (
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.path;
                        
                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            onClick={onClose}
                            className={`
                              group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                              ${isChildActive 
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                              }
                            `}
                          >
                            <ChildIcon className={`
                              mr-3 h-4 w-4 flex-shrink-0
                              ${isChildActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                            `} />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
