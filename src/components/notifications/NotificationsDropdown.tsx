
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { cn } from '@/lib/utils';

const NotificationsDropdown = () => {
  const notifications = useSelector((state: RootState) => state.notifications.items);
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-md shadow-md z-50">
      <div className="p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={cn(
                  "p-4 border-b last:border-0 cursor-pointer hover:bg-accent/10",
                  !notification.read && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
