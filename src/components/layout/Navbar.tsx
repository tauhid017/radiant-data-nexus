
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setTheme } from '@/store/preferencesSlice';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.preferences);
  
  // Apply theme class to document when theme changes
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link to="/" className="font-bold text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs">DX</span>
              </div>
              <span>DataXplorer</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
