
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: number;
  high24h?: number;
  low24h?: number;
  image?: string;
}

interface CryptoState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
  selectedCryptos: string[];
  lastUpdated: number | null;
}

const initialState: CryptoState = {
  data: {},
  loading: false,
  error: null,
  selectedCryptos: ['bitcoin', 'ethereum', 'cardano'],
  lastUpdated: null,
};

// Mock API function for crypto data
const fetchCryptoData = async (cryptoId: string) => {
  // This would be replaced with actual CoinGecko or CoinCap API call
  const cryptos = {
    'bitcoin': {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 42568.23,
      priceChangePercent: 2.34,
      volume: 32567890123,
      marketCap: 824567890123,
      lastUpdated: Date.now(),
      high24h: 43125.76,
      low24h: 41890.12,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    'ethereum': {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2344.56,
      priceChangePercent: -1.23,
      volume: 15678901234,
      marketCap: 278901234567,
      lastUpdated: Date.now(),
      high24h: 2390.45,
      low24h: 2330.12,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    'cardano': {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.45,
      priceChangePercent: 3.76,
      volume: 1234567890,
      marketCap: 15678901234,
      lastUpdated: Date.now(),
      high24h: 0.47,
      low24h: 0.44,
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
    }
  };

  return new Promise<CryptoData>((resolve) => {
    setTimeout(() => {
      resolve(cryptos[cryptoId as keyof typeof cryptos]);
    }, 300);
  });
};

export const fetchCrypto = createAsyncThunk(
  'crypto/fetchCrypto',
  async (cryptoId: string) => {
    const response = await fetchCryptoData(cryptoId);
    return response;
  }
);

export const fetchAllCryptos = createAsyncThunk(
  'crypto/fetchAllCryptos',
  async (_, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    const cryptos = state.crypto.selectedCryptos;
    const cryptoData: Record<string, CryptoData> = {};
    
    for (const cryptoId of cryptos) {
      const data = await fetchCryptoData(cryptoId);
      cryptoData[cryptoId] = data;
    }
    
    return cryptoData;
  }
);

export const updateCryptoPriceWebsocket = createAsyncThunk(
  'crypto/updatePrice',
  async (data: {id: string, price: number}) => {
    return data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    addCrypto: (state, action: PayloadAction<string>) => {
      if (!state.selectedCryptos.includes(action.payload)) {
        state.selectedCryptos.push(action.payload);
      }
    },
    removeCrypto: (state, action: PayloadAction<string>) => {
      state.selectedCryptos = state.selectedCryptos.filter(id => id !== action.payload);
      delete state.data[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrypto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrypto.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.id] = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCrypto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      .addCase(fetchAllCryptos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.lastUpdated = Date.now();
      })
      .addCase(fetchAllCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      .addCase(updateCryptoPriceWebsocket.fulfilled, (state, action) => {
        if (state.data[action.payload.id]) {
          state.data[action.payload.id].price = action.payload.price;
          state.data[action.payload.id].lastUpdated = Date.now();
        }
      });
  },
});

export const { addCrypto, removeCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;
