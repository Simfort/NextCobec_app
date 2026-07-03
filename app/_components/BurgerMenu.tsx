"use client";
import Link from "next/link";
import { TextAlignJustify, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {" "}
      <button onClick={() => setOpen(!open)} className="relative z-20">
        {open ? <X /> : <TextAlignJustify />}
      </button>
      <AnimatePresence mode="wait">
        {" "}
        {open && (
          <motion.menu
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className=" flex flex-col right-0 w-full z-10 h-full top-0 p-5 pt-10 fixed bg-secondary/90 gap-5 items-center">
            <h2 className="font-host-grotesk text-2xl">
              Next<span className="text-primary">Cobec</span>
            </h2>
            <nav className="flex gap-5 flex-col">
              <Link className="hover:text-primary transition-colors" href={"/"}>
                Главная
              </Link>
              <Link
                className="hover:text-primary transition-colors"
                href={"/interview/history"}>
                История
              </Link>{" "}
              <Link
                className="hover:text-primary transition-colors"
                href={"/interview"}>
                Начать собеседование
              </Link>
            </nav>
          </motion.menu>
        )}
      </AnimatePresence>
    </div>
  );
}
