import './globals.css'

export const metadata = {
  title: {
    template: '%s | DOWHA KIM',
    default: 'DOWHA KIM',
  },
  description: 'Dowha Kim, a B2B SaaS specialist.',
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
      </body>
    </html>
  )
}