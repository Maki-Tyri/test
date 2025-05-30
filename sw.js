importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCy9CKJ6CELheBhw7Gs0BgsE1E0FsoYdgU",
  authDomain: "project-955237504610034331.firebaseapp.com",
  projectId: "project-955237504610034331",
  storageBucket: "project-955237504610034331.appspot.com",
  messagingSenderId: "76212939677",
  appId: "1:76212939677:web:ef498bc1e4e480ab6e5d74",
  measurementId: "G-WXBEP1LXTX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || "New Message";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: '/firebase-logo.png' // optional icon url
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
