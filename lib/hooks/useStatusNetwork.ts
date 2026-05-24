import { useEffect, useState } from "react";

export default function useStatusNetwork() {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateOfflineStatus = () => setIsOffline(!navigator.onLine);
    updateOfflineStatus();
    window.addEventListener("offline", updateOfflineStatus);
    window.addEventListener("online", updateOfflineStatus);
    return () => {
      window.removeEventListener("offline", updateOfflineStatus);
      window.removeEventListener("online", updateOfflineStatus);
    };
  }, []);
  return isOffline;
}
