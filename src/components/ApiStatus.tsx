import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useHealthCheck } from '../hooks/useApi';

const ApiStatus: React.FC = () => {
  const { health, loading, checkHealth } = useHealthCheck();
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    checkHealth();
    setLastCheck(new Date());

    // Verificar status a cada 30 segundos
    const interval = setInterval(() => {
      checkHealth();
      setLastCheck(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusIcon = () => {
    if (loading) {
      return <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />;
    }

    if (!health) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    if (health.status === 'ok') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Verificando...';
    if (!health) return 'API Offline';
    if (health.status === 'ok') return 'API Online';
    return 'API Instável';
  };

  const getStatusColor = () => {
    if (loading) return 'text-gray-400';
    if (!health) return 'text-red-500';
    if (health.status === 'ok') return 'text-green-500';
    return 'text-yellow-500';
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {health && (
        <div className="text-xs text-gray-500">
          ({formatUptime(health.uptime)})
        </div>
      )}
    </div>
  );
};

export default ApiStatus;