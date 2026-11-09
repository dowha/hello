import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'

// 공통 레이아웃이 html을 그리지 않으므로 404도 틀을 직접 감싼다
export default function NotFound() {
  return (
    <SiteShell lang="ko">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-sm">
        <p>페이지를 찾을 수 없습니다.</p>
        <Link href="/">홈으로</Link>
      </div>
    </SiteShell>
  )
}
