'use client'

import { useState, useEffect } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko' | null>(null)

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ko' | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    } else {
      const userLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
      setLanguage(userLang)
    }
  }, [])

  if (language === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

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
