// 사이트 언어 결정 규칙
// - 언어 버튼으로 직접 고른 경우에만 저장하고, 그 외에는 항상 브라우저 언어를 따른다
// - 서버(middleware.ts)가 쿠키 → Accept-Language 순으로 정해 그 언어로 만든 페이지를 보낸다
// - localStorage는 쿠키를 쓰기 전에 고른 방문자를 위해 함께 읽는다
// - 예전 키(preferredLanguage)는 첫 방문 때 자동 저장된 값이 섞여 있어 버리고 새 키를 쓴다

export type Language = 'ko' | 'en'

export const LANGUAGES: Language[] = ['ko', 'en']
export const LANGUAGE_COOKIE = 'lang'

const STORAGE_KEY = 'dowha:language'
const LEGACY_KEY = 'preferredLanguage'

export function isLanguage(value: unknown): value is Language {
  return value === 'ko' || value === 'en'
}

/**
 * 서버용: 직접 고른 언어(쿠키) → 브라우저 언어(Accept-Language 첫 항목) 순.
 * 언어 정보가 없으면(검색 로봇 등) 한국어
 */
export function languageFromRequest(cookie: string | undefined, acceptLanguage: string | null): Language {
  if (isLanguage(cookie)) return cookie
  const first = acceptLanguage?.trim().toLowerCase()
  if (!first || first.startsWith('*')) return 'ko'
  return first.startsWith('ko') ? 'ko' : 'en'
}

function writeCookie(language: Language) {
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`
}

/** 클라이언트용: 직접 고른 언어가 있으면 반환. 쿠키가 없던 시절에 고른 값은 쿠키로 옮긴다 */
export function storedLanguage(): Language | null {
  try {
    localStorage.removeItem(LEGACY_KEY)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!isLanguage(stored)) return null
    if (!document.cookie.split('; ').includes(`${LANGUAGE_COOKIE}=${stored}`)) writeCookie(stored)
    return stored
  } catch {
    // 시크릿 모드 등 저장소를 못 쓰면 서버가 정한 언어를 따른다
    return null
  }
}

/** 언어 버튼으로 직접 골랐을 때만 호출 */
export function saveLanguage(language: Language) {
  writeCookie(language)
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // 저장 실패는 무시 (쿠키로 기억)
  }
}
