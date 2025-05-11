import { useEffect, useState } from "react";
import useToken from "./useToken";

const apiUrl = import.meta.env.VITE_API_URL;

export default function usePushSubscription() {
  const { token } = useToken();
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // Listen for first user interaction before requesting permission
  useEffect(() => {
    const onFirstInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", onFirstInteraction);
    };
    document.addEventListener("click", onFirstInteraction, { once: true });
    return () => document.removeEventListener("click", onFirstInteraction);
  }, []);

  // Register service worker on mount
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return;
    }
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("SW registered", reg);
        setSwReg(reg);
      })
      .catch((err) => console.error("SW registration failed:", err));
  }, []);

  // Subscribe to push only after SW is registered, token is available, and user has interacted
  useEffect(() => {
    console.log("test suca");
    if (!swReg || !token || !userInteracted) return;
    console.log("test suca i need to get swReg");

    (async () => {
      try {
        // Request notification permission via user gesture
        const permission = await Notification.requestPermission();
        console.log("which permission");
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        // Get existing subscription or subscribe anew

        // Fetch your VAPID key from the server (Base64 URL-safe)
        const resp = await fetch(`${apiUrl}/push/vapidPublicKey`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { key: publicVapidKey } = await resp.json();
        const vapidArray = urlBase64ToUint8Array(publicVapidKey);

        // Try to grab the existing subscription
        let sub = await swReg.pushManager.getSubscription();

        if (sub) {
          // getKey returns an ArrayBuffer | null
          const existingKeyRaw = sub.getKey("p256dh");
          if (existingKeyRaw) {
            // wrap it in a Uint8Array so we can compare byte-by-byte
            const existingKey = new Uint8Array(existingKeyRaw);
            // compare to your VAPID key
            const sameKey =
              existingKey.length === vapidArray.length &&
              existingKey.every((byte, idx) => byte === vapidArray[idx]);

            if (!sameKey) {
              // unsubscribe if the keys differ
              await sub.unsubscribe();
              sub = undefined;
            }
          }
        }

        if (!sub) {
          // now subscribe for real
          sub = await swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidArray,
          });
          await fetch(`${apiUrl}/push/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(sub.toJSON()),
          });
        }
      } catch (err) {
        console.error("Push subscription failed:", err);
      }
    })();
  }, [swReg, token, userInteracted]);
}

// helper to convert base64 VAPID key
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((ch) => ch.charCodeAt(0)));
}
