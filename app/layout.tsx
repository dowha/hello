import './globals.css'

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

// html·body는 언어를 아는 하위 레이아웃이 SiteShell로 그린다 (components/site-shell.tsx)
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
