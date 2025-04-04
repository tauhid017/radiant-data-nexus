
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Weather icon mapper
export function getWeatherIcon(iconCode: string) {
  const iconMap: Record<string, string> = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds day
    '03n': '☁️', // scattered clouds night
    '04d': '☁️', // broken clouds day
    '04n': '☁️', // broken clouds night
    '09d': '🌧️', // shower rain day
    '09n': '🌧️', // shower rain night
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm day
    '11n': '⛈️', // thunderstorm night
    '13d': '❄️', // snow day
    '13n': '❄️', // snow night
    '50d': '🌫️', // mist day
    '50n': '🌫️', // mist night
  };

  return iconMap[iconCode] || '❓';
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// Format price changes
export function formatPriceChange(change: number): string {
  const formatted = change.toFixed(2);
  return change >= 0 ? `+${formatted}%` : `${formatted}%`;
}

// Format temperature
export function formatTemp(temp: number, unit: 'c' | 'f' = 'c'): string {
  if (unit === 'f') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

// Format date
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Format time
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Generate mock historical data for charts
export function generateHistoricalData(
  days: number,
  baseValue: number,
  volatility: number
): {timestamp: number, value: number}[] {
  const data = [];
  const now = Date.now();
  let currentValue = baseValue;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 86400000); // 86400000 = 1 day in ms
    const change = (Math.random() - 0.5) * 2 * volatility; // Random change between -volatility and +volatility
    currentValue += currentValue * change;
    data.push({
      timestamp,
      value: currentValue
    });
  }
  
  return data;
}
