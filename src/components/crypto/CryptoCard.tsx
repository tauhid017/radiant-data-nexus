
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleFavoriteCrypto } from '@/store/preferencesSlice';
import { RootState } from '@/store';
import { CryptoData } from '@/store/cryptoSlice';
import { cn, formatNumber, formatPriceChange } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CryptoCardProps {
  cryptoData: CryptoData;
}

const CryptoCard = ({ cryptoData }: CryptoCardProps) => {
  const dispatch = useDispatch();
  const { favoriteCryptos } = useSelector((state: RootState) => state.preferences);
  
  const isFavorite = favoriteCryptos.includes(cryptoData.id);
  
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {cryptoData.image && (
            <img 
              src={cryptoData.image} 
              alt={cryptoData.name} 
              className="w-6 h-6" 
            />
          )}
          {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => dispatch(toggleFavoriteCrypto(cryptoData.id))}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-primary" : "fill-none"
              )}
            />
            <span className="sr-only">Favorite</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/crypto/${cryptoData.id}`}>
                  View details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="stat-value">${cryptoData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: cryptoData.price < 10 ? 6 : 2
            })}</div>
            <div className={cn(
              "text-sm flex items-center",
              cryptoData.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {cryptoData.priceChangePercent >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPriceChange(cryptoData.priceChangePercent)}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="stat-label">Volume (24h)</div>
            <div>${formatNumber(cryptoData.volume)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <div>
          <div>Market Cap: ${formatNumber(cryptoData.marketCap)}</div>
          <div>Updated {new Date(cryptoData.lastUpdated).toLocaleTimeString()}</div>
        </div>
        <div className="animate-pulse-slow bg-primary/10 text-primary px-2 py-1 rounded text-xs">
          Live ⦿
        </div>
      </CardFooter>
    </Card>
  );
};

export default CryptoCard;
