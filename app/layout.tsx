import './globals.css'
import Footer from '@/components/ui/footer'
import Script from 'next/script'
import GTMTracker from '@/components/GTMTracker' // 👈 GTM 트래킹 컴포넌트 추가

// 모바일 브라우저 상단 색도 배경과 맞춤 (blog와 동일)
// tailwind page 색과 같은 값
export const viewport = { themeColor: '#FCFCFC' }

export const metadata = {
  // OG 이미지 등 상대 경로 메타를 절대 URL로 만들기 위한 기준 주소
  metadataBase: new URL('https://dowha.kim'),
  twitter: {
    card: 'summary_large_image',
  },
  title: {
    template: '%s | Dowha Kim',
    default: 'Dowha Kim',
  },
  description: 'a B2B SaaS Specialist.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dowha.kim',
  },
  icons: {
    icon: [
      { url: '/logomark.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://dowha.kim',
  },
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 브라우저 확장(HWP 뷰어 등)이 html 태그에 속성을 붙여 생기는 경고 방지
    <html lang="ko" suppressHydrationWarning>
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
