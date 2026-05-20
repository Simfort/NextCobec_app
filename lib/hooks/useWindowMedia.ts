// @/lib/hooks/useWindowMedia
"use client";
import { useEffect, useState } from "react";

export default function useWindowMedia(query: string) {
  const [isQuery, setIsQuery] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setIsQuery(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsQuery(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return isQuery;
}

export const useIsPhone = () => {
  const isPhone = useWindowMedia("(max-width: 640px)");
  return isPhone;
};
