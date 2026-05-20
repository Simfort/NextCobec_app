"use client";

import { useIsPhone } from "@/lib/hooks/useWindowMedia";

import Link from "next/link";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const isPhone = useIsPhone();

  if (isPhone)
    return (
      <header className="flex h-20 py-5 z-20  text-foreground   fixed top-0 w-full pr-5 font-bold justify-end">
        <BurgerMenu />
      </header>
    );
  return (
    <header className="flex h-20 py-5 z-20  text-foreground bg-background  fixed top-0 w-full items-center font-bold justify-around">
      <h2 className="font-host-grotesk text-2xl">
        Next<span className="text-primary">Cobec</span>
      </h2>
      <nav className="flex gap-5 items-center">
        <Link className="hover:text-primary transition-colors" href={"/"}>
          Главная
        </Link>
        <Link
          className="hover:text-primary transition-colors"
          href={"/interview/history"}>
          История
        </Link>{" "}
        <Link
          className="hover:opacity-50 bg-primary active:opacity-40 text-background p-2 rounded-md transition-opacity"
          href={"/interview"}>
          Начать собеседование
        </Link>
      </nav>
    </header>
  );
}
