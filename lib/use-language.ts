'use client'

import { useLayoutEffect, useState } from 'react'
import { LANGUAGE_PENDING_ATTR, resolveLanguage, type Language } from '@/lib/language'

/**
 * 홈·이력서 화면 언어. 서버는 한국어로 그리고, 화면에 그려지기 전(layout effect)에 방문자 언어로 바꾼다.
 * useEffect를 쓰면 페이지 이동 때 한국어가 한 번 그려진 뒤 바뀔 수 있다
 */
export function usePageLanguage() {
  const [language, setLanguage] = useState<Language>('ko')

  useLayoutEffect(() => {
    setLanguage(resolveLanguage())
  }, [])

  // 스크린리더·번역기가 화면 언어를 알 수 있도록 html lang도 맞추고, 숨겨 둔 본문을 보인다
  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.documentElement.removeAttribute(LANGUAGE_PENDING_ATTR)
  }, [language])

  return [language, setLanguage] as const
}
