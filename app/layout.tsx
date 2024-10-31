import './globals.css'
import Footer from '@/components/ui/footer'

export const metadata = {
  title: {
    template: '%s | Dowha Kim',
    default: 'Dowha Kim',
  },
  description: 'a Digital Maker and B2B SaaS Specialist.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.dowha.kim',
  },
  icons: {
		icon: "/favicon.ico",
	},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        {children}

        <Footer />

      </body>
    </html>
  )
}
