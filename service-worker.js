self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('push', (e) => {
  const { body, url, title } = e.data.json();

  /**
   * @type {ServiceWorkerRegistration}
   */
  const registration = self.registration;

  /**
   * @type {NotificationOptions}
   */
  const options = {
    body,
    tag: url,
    // safari doesn't yet support user-defined "action",
    // so we overload the "tag" field to pass thru a url
    // used as the action on click of the notification
  };
  e.waitUntil(registration.showNotification(title, options));
});

self.addEventListener('notificationclick', async (event) => {
  await clients.openWindow(event.notification.tag);    
  event.notification.close();
});
