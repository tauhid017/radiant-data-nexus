
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchAllWeather, WeatherData } from '@/store/weatherSlice';
import { fetchAllCryptos, CryptoData } from '@/store/cryptoSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WeatherCard from '@/components/weather/WeatherCard';
import CryptoCard from '@/components/crypto/CryptoCard';
import NewsCard from '@/components/news/NewsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather);
  const crypto = useSelector((state: RootState) => state.crypto);
  const refreshInterval = useSelector((state: RootState) => state.preferences.refreshInterval);
  
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin Surpasses $45,000 as Institutional Interest Grows',
      description: 'Major financial institutions continue to increase their crypto holdings as Bitcoin reaches new monthly highs.',
      url: '#',
      source: 'Crypto News Today',
      publishedAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1587&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'Extreme Weather Events Linked to Climate Change, Study Finds',
      description: 'New research confirms the connection between rising global temperatures and increased frequency of severe weather phenomena.',
      url: '#',
      source: 'Weather Report',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Ethereum 2.0 Upgrade Timeline Announced',
      description: 'Developers have released the roadmap for the next major upgrade to the Ethereum network, promising improved scalability.',
      url: '#',
      source: 'Blockchain Times',
      publishedAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1559&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'Tokyo Prepares for Summer Heat as Olympics Approach',
      description: 'Officials implement cooling measures across the city as meteorologists predict record temperatures during the upcoming games.',
      url: '#',
      source: 'Global Weather Center',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Cardano Partners with African Nations for Blockchain Identity Solution',
      description: 'New initiative aims to provide secure digital identities to millions using blockchain technology.',
      url: '#',
      source: 'Crypto Daily',
      publishedAt: new Date().toISOString(),
    }
  ]);
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchAllWeather()),
        dispatch(fetchAllCryptos())
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
    
    // Simulate WebSocket connections
    const webSocketService = import('@/services/WebSocketService')
      .then(module => module.webSocketService)
      .then(service => {
        service.connect();
        return service;
      });
    
    // Auto-refresh data
    const refreshTimer = setInterval(() => {
      fetchAllData();
    }, refreshInterval * 1000);
    
    return () => {
      clearInterval(refreshTimer);
      webSocketService.then(service => service.disconnect());
    };
  }, [dispatch, refreshInterval]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {(weather.error || crypto.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {weather.error || crypto.error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAllData}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Weather</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {weather.loading && !weather.data && (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted h-32 rounded-t-lg"></CardHeader>
              <CardContent className="py-6">
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {Object.values(weather.data).map((cityData: WeatherData) => (
          <WeatherCard key={cityData.cityId} weatherData={cityData} />
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Cryptocurrency</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {crypto.loading && !crypto.data && (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {Object.values(crypto.data).map((cryptoData: CryptoData) => (
          <CryptoCard key={cryptoData.id} cryptoData={cryptoData} />
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map(newsItem => (
          <NewsCard key={newsItem.id} newsItem={newsItem} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Index;
