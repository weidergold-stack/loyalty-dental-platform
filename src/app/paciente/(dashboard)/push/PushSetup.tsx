"use client";

import { useEffect, useRef } from "react";
import { savePushSubscription, removePushSubscription } from "./actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i);
  return output;
}

export function PushSetup() {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;
    attempted.current = true;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        const existingSub = await reg.pushManager.getSubscription();
        if (existingSub) {
          await savePushSubscription(JSON.parse(JSON.stringify(existingSub)));
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });
        await savePushSubscription(JSON.parse(JSON.stringify(sub)));
      } catch {
        // Silently ignore — push is a nice-to-have enhancement
      }
    })();
  }, []);

  return null;
}
