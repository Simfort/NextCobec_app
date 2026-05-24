"use client";
import registerServiceWorker from "@/lib/functions/registerServiceWorker";
import { useEffect } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   return registerServiceWorker();
  // }, []);
  return <>{children}</>;
}
