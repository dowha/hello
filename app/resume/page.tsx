'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<'en' | 'ko'>('ko')

  useEffect(() => {
    const langParam = searchParams?.get('lang') as 'en' | 'ko'
    if (langParam && (langParam === 'en' || langParam === 'ko')) {
      setLanguage(langParam)

      // Remove the 'lang' parameter from the URL
      const newUrl = window.location.pathname
      router.replace(newUrl)
    }
  }, [])

  const handleLanguageChange = (newLang: 'en' | 'ko') => {
    setLanguage(newLang)
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-white/30 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-2 text-sm text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <GNB
        showLanguage={true}
        showTheme={false}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />
      <Resume lang={language} />
    </Suspense>
  )
}
