"use client";

import Header from "./_components/Header";
import ScreenSection from "./_components/ScreenSection";

export default function Home() {
  return (
    <div className="flex flex-col h-full items-center">
      <Header />
      <ScreenSection />
    </div>
  );
}
