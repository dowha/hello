import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata = {
  title: {
    template: '%s | DOWHA KIM',
    default: 'DOWHA KIM', // 템플릿이 없을 때 사용됨
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
