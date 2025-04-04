
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAllWeather, WeatherData } from '@/store/weatherSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WeatherCard from '@/components/weather/WeatherCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const WeatherPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather);
  const refreshInterval = useSelector((state: RootState) => state.preferences.refreshInterval);
  
  const fetchData = () => {
    dispatch(fetchAllWeather());
  };
  
  useEffect(() => {
    fetchData();
    
    const refreshTimer = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    
    return () => {
      clearInterval(refreshTimer);
    };
  }, [dispatch, refreshInterval]);
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={weather.loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${weather.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weather.loading && !Object.keys(weather.data).length && (
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
        
        {Object.values(weather.data).map((cityData: WeatherData) => (
          <WeatherCard key={cityData.cityId} weatherData={cityData} />
        ))}
        
        {!weather.loading && !Object.keys(weather.data).length && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4">No weather data available.</p>
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

export default WeatherPage;
