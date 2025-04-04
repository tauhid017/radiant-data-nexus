
import { store } from '@/store';
import { updateCryptoPriceWebsocket } from '@/store/cryptoSlice';
import { addNotification } from '@/store/notificationsSlice';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect() {
    // In a real application, you would connect to the actual WebSocket endpoint
    // For this example, we'll simulate WebSocket behavior
    this.simulateWebSocket();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private simulateWebSocket() {
    console.log('Simulating WebSocket connection...');
    
    // Simulate connection established
    setTimeout(() => {
      console.log('WebSocket connected');
      
      // Simulate receiving crypto price updates
      const cryptoIntervals: NodeJS.Timeout[] = [];
      
      const cryptos = ['bitcoin', 'ethereum', 'cardano'];
      
      cryptos.forEach(crypto => {
        const interval = setInterval(() => {
          // Generate random price change
          const change = (Math.random() - 0.5) * 2 * 0.01; // -1% to +1% change
          
          const state = store.getState();
          const currentPrice = state.crypto.data[crypto]?.price;
          
          if (currentPrice) {
            const newPrice = currentPrice * (1 + change);
            
            // Dispatch price update
            store.dispatch(updateCryptoPriceWebsocket({
              id: crypto,
              price: newPrice
            }));
            
            // Occasionally send a notification for significant price changes
            if (Math.abs(change) > 0.007) { // If change is greater than 0.7%
              const changePercent = (change * 100).toFixed(2);
              const direction = change > 0 ? 'increased' : 'decreased';
              
              store.dispatch(addNotification({
                title: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} price alert`,
                message: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} price has ${direction} by ${Math.abs(Number(changePercent))}% in the last minute.`,
                type: change > 0 ? 'success' : 'warning',
              }));
            }
          }
        }, 60000); // Update every minute
        
        cryptoIntervals.push(interval);
      });
      
      // Simulate weather alerts
      const weatherAlertInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of getting a weather alert
          const cities = ['London', 'New York', 'Tokyo'];
          const alerts = [
            'Heavy rain expected',
            'Temperature drop forecast',
            'Strong winds warning',
            'Heat wave alert',
            'Air quality warning'
          ];
          
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
          
          store.dispatch(addNotification({
            title: `Weather alert for ${randomCity}`,
            message: `${randomAlert} for the next 24 hours.`,
            type: 'warning',
          }));
        }
      }, 300000); // Check every 5 minutes
      
      // Simulate disconnection after some time
      setTimeout(() => {
        console.log('WebSocket disconnected');
        cryptoIntervals.forEach(clearInterval);
        clearInterval(weatherAlertInterval);
        
        // Try to reconnect
        this.reconnectTimeout = setTimeout(() => {
          this.simulateWebSocket();
        }, this.reconnectInterval);
        
      }, 3600000); // Disconnect after an hour
      
    }, 1000); // Simulate 1 second connection delay
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
