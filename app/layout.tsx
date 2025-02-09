import './globals.css'
import Footer from '@/components/ui/footer'
import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const metadata = {
  title: {
    template: '%s | Dowha Kim',
    default: 'Dowha Kim',
  },
  description: 'a Digital Maker and B2B SaaS Specialist.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dowha.kim',
  },
  icons: {
    icon: "/favicon.ico",
  },
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID // 환경 변수에서 GTM ID 가져오기

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname() // 현재 경로 가져오기

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer && GTM_ID) {
      window.dataLayer.push({
        event: 'pageview',
        page: pathname, // 현재 경로
      })
    }
  }, [pathname]) // pathname이 변경될 때마다 실행

  return (
    <html lang="ko">
      <head>
        {/* GTM Script (GTM ID가 있을 때만 실행) */}
        {GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
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
      <body className="antialiased min-h-screen">
        {/* GTM NoScript (for noscript fallback) */}
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

        {children}

        <Footer />
      </body>
    </html>
  )
}
