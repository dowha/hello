'use client'

import { useState } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko'>('ko')

  return (
    <>
      <GNB
        showLanguage={true}
        showTheme={false}
        currentLanguage={language}
        onLanguageChange={setLanguage} // GNB에서 언어 변경 시 setLanguage 호출
      />
      <About language={language} /> {/* onLanguageChange 제거 */}
    </>
  )
}
