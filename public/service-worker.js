self.addEventListener("push", event => {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        data: data.url
      })
    );
  });
  
  self.addEventListener("notificationclick", event => {
    event.notification.close();
    const url = event.notification.data;
    event.waitUntil(
      clients.matchAll({ type: "window" }).then(clientsArr => {
        for (const client of clientsArr) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
    );
  });
  