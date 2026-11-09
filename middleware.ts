import { NextResponse, type NextRequest } from 'next/server'
import { LANGUAGE_COOKIE, languageFromRequest } from '@/lib/language'

/**
 * / · /resume 요청을 방문자 언어로 미리 만든 페이지(app/[lang])에 연결한다. 주소창 주소는 그대로.
 * 언어별 내부 경로(/ko·/en)는 공개하지 않으므로 직접 들어오면 404
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (/^\/(ko|en)(\/|$)/.test(pathname)) {
    return NextResponse.rewrite(new URL('/_not-found', req.url), { status: 404 })
  }

  const lang = languageFromRequest(req.cookies.get(LANGUAGE_COOKIE)?.value, req.headers.get('accept-language'))
  const url = req.nextUrl.clone()
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`
  // 운영 응답은 브라우저가 매번 다시 확인(max-age=0)하므로 언어가 바뀌어도 이전 페이지가 남지 않는다
  return NextResponse.rewrite(url)
}

// 페이지 HTML 요청에만 실행 (이미지·JS·폰트 요청에는 실행되지 않음)
export const config = {
  matcher: ['/', '/resume', '/ko/:path*', '/en/:path*', '/ko', '/en'],
}
