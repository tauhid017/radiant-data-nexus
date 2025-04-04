
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeather } from '@/store/weatherSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Droplets, Thermometer, Wind } from 'lucide-react';
import { formatTemp, generateHistoricalData, getWeatherIcon } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const WeatherDetailPage = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const weatherData = useSelector((state: RootState) => 
    cityId ? state.weather.data[cityId] : null
  );
  const loading = useSelector((state: RootState) => state.weather.loading);
  const error = useSelector((state: RootState) => state.weather.error);
  
  useEffect(() => {
    if (cityId) {
      dispatch(fetchWeather(cityId));
    }
  }, [dispatch, cityId]);
  
  // Generate mock historical data for the charts
  const tempData = generateHistoricalData(30, weatherData?.temp || 20, 0.05).map(item => ({
    date: item.timestamp,
    temperature: item.value
  }));
  
  const humidityData = generateHistoricalData(30, weatherData?.humidity || 60, 0.08).map(item => ({
    date: item.timestamp,
    humidity: item.value > 100 ? 100 : item.value < 0 ? 0 : item.value
  }));
  
  if (!weatherData && !loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/weather">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">City Not Found</h1>
        </div>
        {error && (
          <Card>
            <CardContent className="pt-6">
              <p>Error: {error}</p>
              <Button asChild className="mt-4">
                <Link to="/weather">Go Back</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/weather">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {loading ? 'Loading...' : `${weatherData?.cityName}, ${weatherData?.country}`}
        </h1>
      </div>
      
      {loading ? (
        <div className="grid gap-4">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      ) : weatherData && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Current Weather</CardTitle>
              <CardDescription>
                Last updated: {new Date(weatherData.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Thermometer className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-2xl font-bold">{formatTemp(weatherData.temp)}</p>
                    <p className="text-sm">Feels like {formatTemp(weatherData.feelsLike)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wind className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-2xl font-bold">{weatherData.windSpeed} m/s</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Droplets className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="text-2xl font-bold">{weatherData.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>3 Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData.forecast?.map((day) => (
                  <Card key={day.date} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <p className="font-medium">
                            {format(day.date, 'EEEE')}
                          </p>
                        </div>
                        <span>{format(day.date, 'MMM d')}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{getWeatherIcon(day.icon)}</span>
                          <p className="text-sm">{day.description}</p>
                        </div>
                        <p className="text-xl font-bold">{formatTemp(day.temp)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="temperature">
                <TabsList className="mb-4">
                  <TabsTrigger value="temperature">Temperature</TabsTrigger>
                  <TabsTrigger value="humidity">Humidity</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="temperature">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={tempData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(date, 'MMM d')} 
                          interval={5}
                        />
                        <YAxis
                          label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
                          labelFormatter={(date) => format(date, 'MMM d, yyyy')}
                        />
                        <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="humidity">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={humidityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(date, 'MMM d')} 
                          interval={5}
                        />
                        <YAxis
                          label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Humidity']}
                          labelFormatter={(date) => format(date, 'MMM d, yyyy')}
                        />
                        <Area type="monotone" dataKey="humidity" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHumidity)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Temperature (°C)</TableHead>
                        <TableHead>Humidity (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tempData.slice(0, 10).map((day, index) => (
                        <TableRow key={day.date}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(day.date, 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>{day.temperature.toFixed(1)}</TableCell>
                          <TableCell>{humidityData[index].humidity.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default WeatherDetailPage;
