import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-4 overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
