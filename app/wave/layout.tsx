import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'

// 관리자 페이지: 검색 노출 금지
export const metadata: Metadata = {
  title: 'Wave',
  robots: { index: false, follow: false },
}

export default function WaveLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="ko">{children}</SiteShell>
}
