'use client'

import { useEffect, useState } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'

type Language = 'en' | 'ko'

export default function Page() {
  // 서버 렌더링과 어긋나지 않도록 언어는 마운트 후 결정 (저장값 → 브라우저 언어 순)
  const [language, setLanguage] = useState<Language | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('preferredLanguage') as Language | null
    setLanguage(stored ?? (navigator.language.startsWith('ko') ? 'ko' : 'en'))
  }, [])

  // 스크린리더·번역기가 화면 언어를 알 수 있도록 html lang도 맞춘다
  useEffect(() => {
    if (language) document.documentElement.lang = language
  }, [language])

  if (!language) return null

  return (
    <>
      <GNB
        showLanguage={true}
        showTheme={false}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <About language={language} />
    </>
  )
}
