
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCrypto } from '@/store/cryptoSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { formatNumber, generateHistoricalData } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CryptoDetailPage = () => {
  const { cryptoId } = useParams<{ cryptoId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const cryptoData = useSelector((state: RootState) => 
    cryptoId ? state.crypto.data[cryptoId] : null
  );
  const loading = useSelector((state: RootState) => state.crypto.loading);
  const error = useSelector((state: RootState) => state.crypto.error);
  
  useEffect(() => {
    if (cryptoId) {
      dispatch(fetchCrypto(cryptoId));
    }
  }, [dispatch, cryptoId]);
  
  // Generate mock historical data for the charts
  const priceData = generateHistoricalData(30, cryptoData?.price || 1000, 0.03).map(item => ({
    date: item.timestamp,
    price: item.value
  }));
  
  const volumeData = generateHistoricalData(30, cryptoData?.volume || 1000000, 0.1).map(item => ({
    date: item.timestamp,
    volume: item.value
  }));
  
  if (!cryptoData && !loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/crypto">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Not Found</h1>
        </div>
        {error && (
          <Card>
            <CardContent className="pt-6">
              <p>Error: {error}</p>
              <Button asChild className="mt-4">
                <Link to="/crypto">Go Back</Link>
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
          <Link to="/crypto">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {loading ? (
            'Loading...'
          ) : (
            <>
              {cryptoData?.image && (
                <img src={cryptoData.image} alt={cryptoData.name} className="w-8 h-8" />
              )}
              {cryptoData?.name} ({cryptoData?.symbol.toUpperCase()})
            </>
          )}
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
      ) : cryptoData && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Current Price</CardTitle>
              <CardDescription>
                Last updated: {new Date(cryptoData.lastUpdated).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">${cryptoData.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: cryptoData.price < 10 ? 6 : 2
                    })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {cryptoData.priceChangePercent >= 0 ? (
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 p-3 rounded-full">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">24h Change</p>
                    <p className={`text-2xl font-bold ${
                      cryptoData.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cryptoData.priceChangePercent >= 0 ? '+' : ''}
                      {cryptoData.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">24h High</p>
                  <p className="text-xl font-bold">${cryptoData.high24h?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: cryptoData.high24h < 10 ? 6 : 2
                  }) || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">24h Low</p>
                  <p className="text-xl font-bold">${cryptoData.low24h?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: cryptoData.low24h < 10 ? 6 : 2
                  }) || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-xl font-bold">${formatNumber(cryptoData.marketCap)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-xl font-bold">${formatNumber(cryptoData.volume)}</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 flex items-center">
                  <div className="animate-pulse-slow bg-primary/10 text-primary px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1">
                    Live Price Updates ⦿
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="price">
                <TabsList className="mb-4">
                  <TabsTrigger value="price">Price Chart</TabsTrigger>
                  <TabsTrigger value="volume">Volume Chart</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="price">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={priceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
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
                          label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                          labelFormatter={(date) => format(date, 'MMM d, yyyy')}
                        />
                        <Area type="monotone" dataKey="price" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="volume">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={volumeData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(date, 'MMM d')} 
                          interval={5}
                        />
                        <YAxis
                          label={{ value: 'Volume (USD)', angle: -90, position: 'insideLeft' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <Tooltip 
                          formatter={(value: number) => [`$${formatNumber(value)}`, 'Volume']}
                          labelFormatter={(date) => format(date, 'MMM d, yyyy')}
                        />
                        <Bar dataKey="volume" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Price (USD)</TableHead>
                        <TableHead className="text-right">Volume (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceData.slice(0, 10).map((day, index) => (
                        <TableRow key={day.date}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(day.date, 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${day.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${formatNumber(volumeData[index].volume)}</TableCell>
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

export default CryptoDetailPage;
