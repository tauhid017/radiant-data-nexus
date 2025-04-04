
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Cloud, LineChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const routes = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/' 
    },
    { 
      icon: Cloud, 
      label: 'Weather', 
      href: '/weather' 
    },
    { 
      icon: LineChart, 
      label: 'Crypto', 
      href: '/crypto' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      href: '/settings' 
    }
  ];
  
  return (
    <nav className="hidden md:block w-64 border-r bg-background h-[calc(100vh-4rem)] p-4 sticky top-16">
      <div className="space-y-4">
        <div className="py-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">Menu</h3>
          <ul className="mt-2 space-y-1">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  to={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    location.pathname === route.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
