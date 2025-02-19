self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    self.skipWaiting(); // Forces new SW to take control immediately
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
    event.waitUntil(clients.claim()); // Forces control of open clients
  });
  