
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAllCryptos } from '@/store/cryptoSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CryptoCard from '@/components/crypto/CryptoCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const CryptoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const crypto = useSelector((state: RootState) => state.crypto);
  const refreshInterval = useSelector((state: RootState) => state.preferences.refreshInterval);
  
  const fetchData = () => {
    dispatch(fetchAllCryptos());
  };
  
  useEffect(() => {
    fetchData();
    
    // Simulate WebSocket connections
    const webSocketService = import('@/services/WebSocketService')
      .then(module => module.webSocketService)
      .then(service => {
        service.connect();
        return service;
      });
    
    const refreshTimer = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    
    return () => {
      clearInterval(refreshTimer);
      webSocketService.then(service => service.disconnect());
    };
  }, [dispatch, refreshInterval]);
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={crypto.loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${crypto.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crypto.loading && !Object.keys(crypto.data).length && (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded mt-4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {Object.values(crypto.data).map(cryptoData => (
          <CryptoCard key={cryptoData.id} cryptoData={cryptoData} />
        ))}
        
        {!crypto.loading && !Object.keys(crypto.data).length && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4">No cryptocurrency data available.</p>
              <Button onClick={fetchData}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CryptoPage;
