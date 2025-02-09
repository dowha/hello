"use client"; // 👈 이 파일을 클라이언트 컴포넌트로 설정

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // 환경 변수 사용

export default function GTMTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && GTM_ID) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "pageview",
        page: pathname,
      });
    }
  }, [pathname]); // pathname 변경 시 실행

  return null; // UI를 렌더링하지 않음
}
