"use client";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ y: 50, opacity: 0 }}
      className="w-full max-w-md mx-auto flex  gap-2 mt-4">
      <LoaderCircle className="text-primary animate-spin" />

      <div className="relative w-full pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-linear-to-r from-primary to-secondary transition-all duration-300`}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>Загрузка: {progress}%</span>
          {progress === 100 && <span>Готово!</span>}
        </div>
      </div>
    </motion.div>
  );
}
