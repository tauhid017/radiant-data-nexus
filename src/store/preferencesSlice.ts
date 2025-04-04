
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  favoriteCities: string[];
  favoriteCryptos: string[];
  refreshInterval: number; // in seconds
  theme: 'light' | 'dark' | 'system';
}

// Load preferences from localStorage if available
const loadPreferences = (): Partial<PreferencesState> => {
  try {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return {};
};

const initialState: PreferencesState = {
  favoriteCities: [],
  favoriteCryptos: [],
  refreshInterval: 60, // 60 seconds by default
  theme: 'system',
  ...loadPreferences(),
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const cityId = action.payload;
      if (state.favoriteCities.includes(cityId)) {
        state.favoriteCities = state.favoriteCities.filter(id => id !== cityId);
      } else {
        state.favoriteCities.push(cityId);
      }
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload;
      if (state.favoriteCryptos.includes(cryptoId)) {
        state.favoriteCryptos = state.favoriteCryptos.filter(id => id !== cryptoId);
      } else {
        state.favoriteCryptos.push(cryptoId);
      }
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
  },
});

export const {
  toggleFavoriteCity,
  toggleFavoriteCrypto,
  setRefreshInterval,
  setTheme,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
