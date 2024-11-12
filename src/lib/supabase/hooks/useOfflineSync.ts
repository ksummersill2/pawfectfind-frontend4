import { useEffect, useState } from 'react';
import { checkConnection, processOfflineQueue } from '../client';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkAndSync = async () => {
      const online = await checkConnection();
      setIsOnline(online);

      if (online) {
        try {
          await processOfflineQueue();
        } catch (err) {
          console.error('Error processing offline queue:', err);
        }
      }
    };

    // Check connection status and sync data every minute
    interval = setInterval(checkAndSync, 60000);
    checkAndSync();

    // Add online/offline event listeners
    window.addEventListener('online', checkAndSync);
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkAndSync);
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  return { isOnline };
};

export default useOfflineSync;