'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'
import { useSearchParams } from 'next/navigation'

// Separate component to handle URL params and language state
function LanguageHandler({ onLanguageChange }: { onLanguageChange: (lang: 'en' | 'ko') => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const langParam = searchParams?.get('lang') as 'en' | 'ko'
    if (langParam && (langParam === 'en' || langParam === 'ko')) {
      onLanguageChange(langParam)

      // Remove the 'lang' parameter from the URL
      const newUrl = window.location.pathname
      router.replace(newUrl)
    }
  }, [searchParams, router, onLanguageChange])

  return null
}

// Loading component for better reusability
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
  const [language, setLanguage] = useState<'en' | 'ko'>('ko')

  const handleLanguageChange = (newLang: 'en' | 'ko') => {
    setLanguage(newLang)
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* Wrap the component using useSearchParams in its own Suspense boundary */}
      <Suspense>
        <LanguageHandler onLanguageChange={handleLanguageChange} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>

        <GNB
          showLanguage={true}
          showTheme={false}
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />

      </Suspense>

      <Suspense fallback={<div>Loading</div>}>
        <Resume lang={language} />
      </Suspense>
    </Suspense>
  )
}
