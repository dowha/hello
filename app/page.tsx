'use client'

import { useState, useEffect } from 'react'
import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ko' | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ko' | null
      if (storedLanguage) {
        setLanguage(storedLanguage)
      } else {
        const userLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
        setLanguage(userLang)
      }
    }
  }, [])

  if (language === null) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-white p-4 pt-16">        <div className="max-w-md w-full space-y-4 animate-pulse">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex flex-col items-center space-y-2 pb-3">
            <div className="relative w-14 h-14 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>

          </div>

          {/* 소개 텍스트 스켈레톤 (더 길게 조정) */}
          <div className="space-y-4 text-left">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-white rounded w-3/4"></div>

          </div>

          {/* 버튼 스켈레톤 (2개 추가) */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f6f5f4]">
            <div className="h-10 bg-gray-200 rounded col-span-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* 페이지 하단 여백 확보 */}
          <div className="h-24"></div>
        </div>
      </div>
    )
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
