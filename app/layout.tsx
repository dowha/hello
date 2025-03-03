import './globals.css'
import Footer from '@/components/ui/footer'
import Script from 'next/script'
import GTMTracker from '@/components/GTMTracker' // 👈 GTM 트래킹 컴포넌트 추가

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
    icon: '/favicon.ico',
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
    <html lang="ko">
      <head>
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
      <body className="antialiased min-h-screen">
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
        {children}
        <Footer />
      </body>
    </html>
  )
}
