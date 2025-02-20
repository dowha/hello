'use client'

import { useState, useEffect, Suspense } from 'react'
import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'

// Loading component
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
  const [language, setLanguage] = useState<'en' | 'ko'>('en') // 서버에서는 'en'으로 고정

  // ✅ 클라이언트에서만 언어 설정 변경 (hydration error 방지)
  useEffect(() => {
    const userLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
    setLanguage(userLang)
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Suspense fallback={<div>Loading...</div>}>
        <GNB
          showLanguage={true}
          showTheme={false}
          currentLanguage={language}
          onLanguageChange={setLanguage} // ✅ 언어 변경 핸들러
        />
      </Suspense>

      <Suspense fallback={<div>Loading</div>}>
        <Resume lang={language} />
      </Suspense>
    </Suspense>
  )
}
