"use client";

import { useEffect } from "react";

export function ServiceWorkerUnregister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Check if we've already tried to unregister to prevent loops
      if (sessionStorage.getItem("sw-unregistered")) {
        return;
      }

      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          if (registrations.length > 0) {
            console.log("Unregistering existing service workers...");
            registrations.forEach((registration) => {
              registration.unregister();
            });
            // Set a flag in session storage and then reload
            sessionStorage.setItem("sw-unregistered", "true");
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("Error unregistering service worker: ", error);
        });
    }
  }, []);

  return null;
}