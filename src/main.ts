window.onload = (): void => {
  "use strict";
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("Service Worker registered successfully.");
      })
      .catch((error: unknown) => {
        console.error("Service Worker registration failed:", error);
      });
  }
};
