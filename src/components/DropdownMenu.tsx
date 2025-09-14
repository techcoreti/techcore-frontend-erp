import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  destructive?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Botão de três pontos */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Ações"
      >
        <MoreVertical className="h-4 w-4 text-gray-600" />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] animate-in slide-in-from-top-2 duration-200" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleItemClick(item.onClick)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center space-x-3 text-sm ${
                  item.destructive 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${item.className || ''}`}
              >
                <div className="flex-shrink-0 dropdown-icon">
                  {item.icon}
                </div>
                <span className="flex-1">{item.label}</span>
              </button>
              {index < items.length - 1 && (
                <div className="border-t border-gray-100 my-1"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
