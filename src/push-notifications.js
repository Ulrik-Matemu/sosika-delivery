import { messaging, getToken, onMessage } from "./firebase";

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await getToken(messaging, { vapidKey: "BEC4ncuS652Wnb0J2QC2M2ylbtdpwHXj7NVEHrprgj1PcvHjZpo2jID6-YGKCXSy25P5mTrVWlJmzQhWIzoLJ_k" });
         
            localStorage.setItem("FCMToken", token);
            console.log("FCM Token received and stored:", token);
            // Send this token to your backend for storing and sending notifications
            
        } else {
            console.log("Notification permission denied.");
        }
    } catch (err) {
        console.error("Error requesting notification permission:", err);
    }
}

requestNotificationPermission();

// Handle incoming notifications when the app is in the foreground
onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png", // Ensure icon path is correct
    });
});
