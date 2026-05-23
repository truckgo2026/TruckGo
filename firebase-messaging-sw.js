importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBstQoQeTedaK2dLI5KZn35zudIOomYuMY",
  authDomain: "truckgo-6bf17.firebaseapp.com",
  projectId: "truckgo-6bf17",
  storageBucket: "truckgo-6bf17.appspot.com",
  messagingSenderId: "763417873532",
  appId: "1:763417873532:web:e6fd6f11a8e051a6e04df9",
});

const messaging = firebase.messaging();

// התראות ברקע (כשהאפליקציה סגורה)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const tag = payload.data?.tag || 'truckgo';

  self.registration.showNotification(title || 'TruckGo', {
    body: body || '',
    icon: '/icon.png',
    badge: '/icon.png',
    tag,
    vibrate: [200, 100, 200],
    requireInteraction: false,
    data: payload.data || {},
  });
});

// לחיצה על התראה פותחת את האפליקציה
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// הצג notification שנשלחה מהאפליקציה הפתוחה
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: tag || 'truckgo',
      vibrate: [200, 100, 200],
    });
  }
});
