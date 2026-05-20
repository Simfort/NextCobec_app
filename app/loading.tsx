"use client";
import { motion } from "framer-motion";
export default function Loading() {
  return (
    <div className="fixed inset-0 w-full flex  items-center justify-center h-screen bg-background">
      <div className="flex gap-2 items-center">
        {" "}
        {new Array(4).fill(null).map((point, index) => (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 0.1 * (index + 1) }}
            key={index}
            className={`size-5 ${index % 2 === 0 ? "bg-primary" : "bg-foreground"} rounded-full`}></motion.div>
        ))}
      </div>
    </div>
  );
}
