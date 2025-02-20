'use client'

import { useState, useEffect, Suspense } from 'react'
import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/30 backdrop-blur-sm">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-transparent animate-spin" />
        </div>
        <p className="mt-2 text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko' | null>(null) // ✅ 초기값을 null로 설정

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ko' | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    } else {
      const userLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
      setLanguage(userLang)
    }
  }, [])

  // ✅ 언어가 `null`이면 로딩 화면을 먼저 보여줌 (Hydration Error 방지)
  if (language === null) {
    return <LoadingSpinner />
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Suspense fallback={<div>Loading...</div>}>
        <GNB
          showLanguage={true}
          showTheme={false}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </Suspense>

      <Suspense fallback={<div>Loading</div>}>
        <Resume lang={language} />
      </Suspense>
    </Suspense>
  )
}
