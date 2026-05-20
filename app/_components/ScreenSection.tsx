"use client";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ScreenSection() {
  return (
    <section className="flex font-bold h-screen text-background justify-center  py-50 relative z-10 items-center w-full flex-col gap-5 ">
      <div className="absolute inset-0 w-full h-full bg-secondary/80 z-9"></div>
      <video
        src="/teachvideo.mp4"
        autoPlay
        playsInline
        muted
        loop
        className="w-full top-0 h-full shrink-0 object-cover object-center absolute"></video>
      <div className="rounded-full px-5 py-2 relative overflow-hidden z-10 bg-primary/20 border-primary text-sm w-max text-primary border">
        <p> ИИ ассистент</p>
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: "200%" }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          className="h-20 -translate-x-25 w-10 absolute bg-background blur-xl"></motion.div>
      </div>
      <h1 className="text-5xl relative z-10 max-sm:text-3xl max-sm:leading-10  leading-20 text-center">
        Подготовьтесь к собеседование всего <br />
        написав <span className="text-primary  ">запрос</span>
      </h1>
      <p className="text-background/60 relative z-10 text-center">
        ИИ вам поможет
      </p>
      <div className="flex justify-center max-sm:flex-col relative z-10 items-center gap-5 px-5">
        {" "}
        <Link
          href={"/interview"}
          className="bg-primary w-max border border-primary max-sm:w-full text-background hover:opacity-40 active:opacity-50 transition-all cursor-pointer px-5 py-2 rounded-md ">
          Начать собеседование
        </Link>{" "}
        <button className="border-primary flex items-center gap-2  max-sm:w-full text-primary border hover:text-background hover:bg-secondary active:opacity-50 transition-all cursor-pointer px-5 py-2 rounded-md ">
          <Send /> Телеграмм канал
        </button>
      </div>
    </section>
  );
}
