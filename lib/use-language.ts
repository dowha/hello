'use client'

import { useLayoutEffect, useState } from 'react'
import { storedLanguage, type Language } from '@/lib/language'

/**
 * 홈·이력서 화면 언어. 서버(middleware.ts)가 정한 언어로 시작하고,
 * 쿠키 없이 예전에 고른 언어만 화면이 그려지기 전(layout effect)에 바로잡는다
 */
export function usePageLanguage(initial: Language) {
  const [language, setLanguage] = useState<Language>(initial)

  useLayoutEffect(() => {
    const stored = storedLanguage()
    if (stored && stored !== initial) setLanguage(stored)
  }, [initial])

  // 스크린리더·번역기가 화면 언어를 알 수 있도록 html lang도 맞춘다
  useLayoutEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return [language, setLanguage] as const
}
