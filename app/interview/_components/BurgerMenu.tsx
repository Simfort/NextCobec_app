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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full backdrop-blur-2xl bg-background/30 top-0 flex justify-end fixed left-0 h-full">
            <motion.menu
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
              className=" flex flex-col z-10 h-full w-80   p-5 pt-10 bg-background shadow gap-5 items-center">
              <h2 className="font-host-grotesk text-2xl">
                Next<span className="text-primary">Cobec</span>
              </h2>
              <nav className="flex gap-5 font-light flex-col">
                <Link
                  className="hover:text-primary transition-colors"
                  href={"/"}>
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
              </nav>{" "}
              <div className="p-6 mt-auto border-t border-accent/20">
                <p className="text-sm text-foreground/60 text-center">
                  © 2026 NextCobec. Все права защищены.
                </p>
              </div>
            </motion.menu>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
