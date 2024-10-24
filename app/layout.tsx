import './globals.css'
import Footer from '@/components/footer'

export const metadata = {
  title: {
    template: '%s | Dowha Kim',
    default: 'Dowha Kim',
  },
  description: 'Dowha Kim, a Digital Maker and B2B SaaS Specialist.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.dowha.kim',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <Footer />
      </body>
    </html>
  )
}
