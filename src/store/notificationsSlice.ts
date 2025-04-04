
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: [
    {
      id: '1',
      title: 'Bitcoin price alert',
      message: 'Bitcoin price has increased by 5% in the last hour.',
      type: 'info',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'Weather warning',
      message: 'Severe thunderstorms expected in New York today.',
      type: 'warning',
      timestamp: Date.now() - 3600000, // 1 hour ago
      read: true,
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      state.items.unshift({
        id: uuidv4(),
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
