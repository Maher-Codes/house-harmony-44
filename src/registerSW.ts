export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('HouseHub SW registered:', registration.scope);
    } catch (err) {
      console.error('HouseHub SW registration failed:', err);
    }
  }
};
