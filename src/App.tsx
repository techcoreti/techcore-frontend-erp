import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <div className="App">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
