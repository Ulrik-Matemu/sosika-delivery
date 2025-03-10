// First handle installation and activation to ensure the service worker is registered properly
self.addEventListener('install', event => {
    console.log('Firebase Messaging SW installing...');
    self.skipWaiting(); // Activate worker immediately
  });
  
  self.addEventListener('activate', event => {
    console.log('Firebase Messaging SW now active');
    return self.clients.claim(); // Take control of all clients
  });
  
  // Wrap Firebase imports in try-catch to handle potential errors
  try {
    importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');
    
    console.log('Firebase scripts successfully imported');
    
    // Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyA_Jw-BGThGsqhB8_t5_AH6D9AL1YLCjK8",
      authDomain: "sosika-101.firebaseapp.com",
      projectId: "sosika-101",
      storageBucket: "sosika-101.firebasestorage.app",
      messagingSenderId: "827695672687",
      appId: "1:827695672687:web:85ce347456339ccfd80c9a",
      measurementId: "G-692C6RSH31"
    };
    
    // Initialize with error handling
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase successfully initialized in service worker');
      
      const messaging = firebase.messaging();
      
      // Handle background push notifications
      messaging.onBackgroundMessage((payload) => {
        console.log('Received background message: ', payload);
        
        // Ensure payload has the expected structure
        const title = payload?.notification?.title || 'New Notification';
        const body = payload?.notification?.body || '';
        const icon = '/sosika-delivery/icon.png';
        
        return self.registration.showNotification(title, {
          body: body,
          icon: icon,
          badge: icon
        });
      });
    } catch (initError) {
      console.error('Error initializing Firebase in service worker:', initError);
    }
  } catch (importError) {
    console.error('Error importing Firebase scripts:', importError);
    // Continue service worker execution even if Firebase fails
  }
  
  // Add a message event listener as fallback for communication
  self.addEventListener('message', event => {
    console.log('Service worker received message:', event.data);
    if (event.data && event.data.type === 'PING') {
      event.ports[0].postMessage('PONG');
    }
  });
  
  // Add a fetch handler to keep the service worker alive
  self.addEventListener('fetch', event => {
    // Just add this to ensure the service worker intercepts requests
    // but don't actually modify the responses
    return;
  });