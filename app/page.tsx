'use client'

import { useState } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/gnb'

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko'>('ko')

  return (
    <>
      <GNB
        showLanguage={true}
        showTheme={true}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <About language={language} onLanguageChange={setLanguage} />
    </>
  )
}
