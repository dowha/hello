"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function GTMTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && GTM_ID) {
      window.dataLayer = window.dataLayer || []; // 타입 체크 통과
      (window.dataLayer as Array<Record<string, unknown>>).push({
        event: "pageview",
        page: pathname,
      });
    }
  }, [pathname]);

  return null;
}
