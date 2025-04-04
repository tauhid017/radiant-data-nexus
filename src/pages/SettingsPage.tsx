
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setRefreshInterval, setTheme } from '@/store/preferencesSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { refreshInterval, theme } = useSelector((state: RootState) => state.preferences);
  const [localRefreshInterval, setLocalRefreshInterval] = React.useState(refreshInterval);
  
  const handleRefreshIntervalChange = (value: number[]) => {
    setLocalRefreshInterval(value[0]);
  };
  
  const handleRefreshIntervalSave = () => {
    dispatch(setRefreshInterval(localRefreshInterval));
    toast({
      title: 'Settings saved',
      description: `Refresh interval updated to ${localRefreshInterval} seconds`,
    });
  };
  
  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(value));
    toast({
      title: 'Theme updated',
      description: `Theme set to ${value}`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <div className="grid gap-6">
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Choose your preferred theme appearance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Select 
                        onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
                        defaultValue={theme}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Refresh</CardTitle>
                  <CardDescription>
                    Configure how often data is automatically refreshed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="refresh-interval">Refresh interval (seconds)</Label>
                        <span className="text-sm">{localRefreshInterval} seconds</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          id="refresh-interval"
                          defaultValue={[refreshInterval]}
                          max={300}
                          min={30}
                          step={10}
                          onValueChange={handleRefreshIntervalChange}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handleRefreshIntervalSave}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for external services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="openweathermap-key">OpenWeatherMap API Key</Label>
                    <Input
                      id="openweathermap-key"
                      type="password"
                      placeholder="Enter API key"
                    />
                    <p className="text-sm text-muted-foreground">
                      Get your API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenWeatherMap</a>
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="coingecko-key">CoinGecko API Key</Label>
                    <Input
                      id="coingecko-key"
                      type="password"
                      placeholder="Enter API key"
                    />
                    <p className="text-sm text-muted-foreground">
                      Get your API key from <a href="https://www.coingecko.com/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">CoinGecko</a>
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="newsdata-key">NewsData.io API Key</Label>
                    <Input
                      id="newsdata-key"
                      type="password"
                      placeholder="Enter API key"
                    />
                    <p className="text-sm text-muted-foreground">
                      Get your API key from <a href="https://newsdata.io/" target="_blank" rel="noopener noreferrer" className="text-primary underline">NewsData.io</a>
                    </p>
                  </div>
                  
                  <Button>
                    Save API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
