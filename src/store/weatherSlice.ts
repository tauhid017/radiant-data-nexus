
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  cityId: string;
  cityName: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
  forecast?: WeatherForecast[];
}

export interface WeatherForecast {
  date: number;
  temp: number;
  description: string;
  icon: string;
}

interface WeatherState {
  data: Record<string, WeatherData>;
  selectedCities: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  data: {},
  selectedCities: ['2643743', '5128581', '1850147'], // London, New York, Tokyo
  loading: false,
  error: null,
  lastUpdated: null,
};

// Mock API function for weather data
const fetchWeatherData = async (cityId: string) => {
  // This would be replaced with actual OpenWeatherMap API call
  const cities = {
    '2643743': {
      cityId: '2643743',
      cityName: 'London',
      country: 'GB',
      temp: 15.2,
      feelsLike: 14.8,
      humidity: 76,
      windSpeed: 4.2,
      description: 'Cloudy',
      icon: '04d',
      timestamp: Date.now(),
      forecast: [
        { date: Date.now() + 86400000, temp: 16.1, description: 'Partly cloudy', icon: '02d' },
        { date: Date.now() + 172800000, temp: 15.7, description: 'Cloudy', icon: '04d' },
        { date: Date.now() + 259200000, temp: 17.3, description: 'Sunny', icon: '01d' },
      ]
    },
    '5128581': {
      cityId: '5128581',
      cityName: 'New York',
      country: 'US',
      temp: 22.8,
      feelsLike: 23.4,
      humidity: 65,
      windSpeed: 3.1,
      description: 'Sunny',
      icon: '01d',
      timestamp: Date.now(),
      forecast: [
        { date: Date.now() + 86400000, temp: 24.2, description: 'Sunny', icon: '01d' },
        { date: Date.now() + 172800000, temp: 23.9, description: 'Partly cloudy', icon: '02d' },
        { date: Date.now() + 259200000, temp: 21.5, description: 'Rain', icon: '10d' },
      ]
    },
    '1850147': {
      cityId: '1850147',
      cityName: 'Tokyo',
      country: 'JP',
      temp: 28.6,
      feelsLike: 30.2,
      humidity: 74,
      windSpeed: 2.4,
      description: 'Clear',
      icon: '01d',
      timestamp: Date.now(),
      forecast: [
        { date: Date.now() + 86400000, temp: 27.8, description: 'Cloudy', icon: '03d' },
        { date: Date.now() + 172800000, temp: 29.1, description: 'Clear', icon: '01d' },
        { date: Date.now() + 259200000, temp: 30.2, description: 'Clear', icon: '01d' },
      ]
    },
  };

  return new Promise<WeatherData>((resolve) => {
    setTimeout(() => {
      resolve(cities[cityId as keyof typeof cities]);
    }, 500);
  });
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (cityId: string) => {
    const response = await fetchWeatherData(cityId);
    return response;
  }
);

export const fetchAllWeather = createAsyncThunk(
  'weather/fetchAllWeather',
  async (_, { getState }) => {
    const state = getState() as { weather: WeatherState };
    const cities = state.weather.selectedCities;
    const weatherData: Record<string, WeatherData> = {};
    
    for (const cityId of cities) {
      const data = await fetchWeatherData(cityId);
      weatherData[cityId] = data;
    }
    
    return weatherData;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<string>) => {
      if (!state.selectedCities.includes(action.payload)) {
        state.selectedCities.push(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.selectedCities = state.selectedCities.filter(id => id !== action.payload);
      delete state.data[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.cityId] = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchAllWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.lastUpdated = Date.now();
      })
      .addCase(fetchAllWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export const { addCity, removeCity } = weatherSlice.actions;
export default weatherSlice.reducer;
