
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from './store';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WeatherPage from "./pages/WeatherPage";
import WeatherDetailPage from "./pages/WeatherDetailPage";
import CryptoPage from "./pages/CryptoPage";
import CryptoDetailPage from "./pages/CryptoDetailPage";
import SettingsPage from "./pages/SettingsPage";

// Initialize the query client
const queryClient = new QueryClient();

// Theme initialization component
const ThemeInitializer = () => {
  const { theme } = useSelector((state: RootState) => state.preferences);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  return null;
};

// Set up the Redux store and router
const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/weather/:cityId" element={<WeatherDetailPage />} />
            <Route path="/crypto" element={<CryptoPage />} />
            <Route path="/crypto/:cryptoId" element={<CryptoDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
