'use client'

import { useState } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko'>(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ko' | null
      return storedLanguage ?? (navigator.language.startsWith('ko') ? 'ko' : 'en')
    }
    return 'ko' // 서버 렌더링 시 기본값 설정
  })

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

