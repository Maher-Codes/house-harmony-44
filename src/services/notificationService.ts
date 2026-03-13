const PUBLIC_VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export const notificationService = {

  // Ask user for permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  },

  // Check if notifications are supported and permitted
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  // Show a local notification (no server needed — works immediately)
  async showLocal(title: string, body: string): Promise<void> {
    if (Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon:    '/icons/icon-192x192.png',
      badge:   '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
    } as any);
  },
};
