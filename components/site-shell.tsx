import Script from 'next/script'
import Footer from '@/components/ui/footer'
import GTMTracker from '@/components/GTMTracker'
import type { Language } from '@/lib/language'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * 모든 페이지의 html·head·body 틀.
 * 공통 레이아웃(app/layout.tsx)은 언어를 몰라서, html lang을 알 수 있는 각 레이아웃(app/[lang]·app/wave·not-found)이 이걸로 감싼다
 */
export function SiteShell({ lang, children }: { lang: Language; children: React.ReactNode }) {
  return (
    // 브라우저 확장(HWP 뷰어 등)이 html 태그에 속성을 붙여 생기는 경고 방지
    <html lang={lang} suppressHydrationWarning>
      {/* App Router 레이아웃에서 쓰는 틀이라 <head>가 맞다 (규칙은 app/ 밖 파일을 Pages Router로 오인) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* 글꼴: CSS @import 대신 head에서 바로 요청하고, 글꼴 파일을 받을 CDN에 미리 연결한다 (blog.dowha.kim과 동일) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        {GTM_ID && (
          <Script id="gtm-script" strategy="lazyOnload">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body className="antialiased min-h-[100dvh] overflow-y-scroll flex flex-col">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        )}
        <GTMTracker /> {/* 👈 GTM 트래킹 컴포넌트 삽입 */}
        {/* 링크 밑줄은 main 안에만 적용된다 (blog.dowha.kim과 같은 규칙) */}
        <main className="flex w-full flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
