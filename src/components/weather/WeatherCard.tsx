
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleFavoriteCity } from '@/store/preferencesSlice';
import { RootState } from '@/store';
import { WeatherData } from '@/store/weatherSlice';
import { cn, formatTemp, getWeatherIcon } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const dispatch = useDispatch();
  const { favoriteCities } = useSelector((state: RootState) => state.preferences);
  
  const isFavorite = favoriteCities.includes(weatherData.cityId);
  
  const getBackgroundColor = () => {
    const { description } = weatherData;
    const desc = description.toLowerCase();
    
    if (desc.includes('rain') || desc.includes('shower')) {
      return 'bg-gradient-to-br from-blue-400 to-blue-700';
    } else if (desc.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-300 to-gray-500';
    } else if (desc.includes('clear') || desc.includes('sun')) {
      return 'bg-gradient-to-br from-yellow-300 to-orange-400';
    } else if (desc.includes('snow')) {
      return 'bg-gradient-to-br from-blue-100 to-blue-300';
    } else if (desc.includes('thunder') || desc.includes('storm')) {
      return 'bg-gradient-to-br from-gray-600 to-gray-800';
    } else {
      return 'bg-gradient-to-br from-blue-200 to-blue-400';
    }
  };
  
  return (
    <Card className="card-hover">
      <CardHeader className={cn("text-white rounded-t-lg", getBackgroundColor())}>
        <div className="flex justify-between items-start">
          <CardTitle>{weatherData.cityName}, {weatherData.country}</CardTitle>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10"
              onClick={() => dispatch(toggleFavoriteCity(weatherData.cityId))}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-white" : "fill-none"
                )}
              />
              <span className="sr-only">Favorite</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/weather/${weatherData.cityId}`}>
                    View details
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-4xl mr-2">{getWeatherIcon(weatherData.icon)}</span>
            <div>
              <p className="text-3xl font-bold">{formatTemp(weatherData.temp)}</p>
              <p className="text-muted-foreground text-sm">{weatherData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="stat-label">Feels like</div>
            <div>{formatTemp(weatherData.feelsLike)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div>
          <div>Humidity: {weatherData.humidity}%</div>
          <div>Wind: {weatherData.windSpeed} m/s</div>
        </div>
        <div className="text-right">
          <div>Updated {new Date(weatherData.timestamp).toLocaleTimeString()}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;
