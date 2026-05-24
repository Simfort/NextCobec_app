"use client";
import { useEffect, useState } from "react";

export default function useCookie<T>() {
  const [cookies, setCookies] = useState<T>({} as T);

  const syncCookies = () => {
    if (typeof window === "undefined") return;
    const newCookies = Object.fromEntries(
      document.cookie.split("; ").map((item) => {
        const [key, ...valueParts] = item.split("=");
        return [
          decodeURIComponent(key),
          decodeURIComponent(valueParts.join("=")),
        ];
      }),
    );
    setCookies(newCookies as T);
  };

  useEffect(() => {
    syncCookies();
  }, []);
  return cookies;
}
