"use client";
import { useIsPhone } from "@/lib/hooks/useWindowMedia";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMount, setIsMount] = useState(false);
  const isPhone = useIsPhone(); // Для SSR, но не для логики

  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) return null;
  if (isPhone) {
    return (
      <header className="flex h-20 py-5 z-20 text-background fixed top-0 w-full pr-5 font-bold justify-end">
        <BurgerMenu />
      </header>
    );
  }

  return (
    <header className="flex h-20 py-5 z-20 text-background fixed top-0 w-full items-center font-bold justify-around">
      <h2 className="font-host-grotesk text-2xl">
        Next<span className="text-primary">Cobec</span>
      </h2>
      <nav className="flex gap-5">
        <Link className="hover:text-primary transition-colors" href="/">
          Главная
        </Link>
        <Link
          className="hover:text-primary transition-colors"
          href="/interview/history">
          История
        </Link>
        <Link
          className="hover:text-primary transition-colors"
          href="/interview">
          Начать собеседование
        </Link>
      </nav>
      <button className="border-primary text-primary border hover:text-background hover:bg-primary/80 active:opacity-50 transition-all cursor-pointer px-5 py-2 rounded-md">
        Войти
      </button>
    </header>
  );
}
