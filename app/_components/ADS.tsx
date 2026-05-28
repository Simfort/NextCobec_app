"use client";
import { useEffect } from "react";

export default function Ads({ blockId }: { blockId: string }) {
  useEffect(() => {
    (window as any).yaContextCb.push(() => {
      (window.Ya as any).Context.AdvManager.render({
        blockId: blockId,
        type: "fullscreen",
        platform: "touch",
      });
    });
  }, [blockId]);

  return <div id={`yandex_rtb_${blockId}`} />;
}
