// 사이트 언어 결정 규칙
// - 언어 버튼으로 직접 고른 경우에만 저장하고, 그 외에는 항상 브라우저 언어를 따른다
// - 예전 키(preferredLanguage)는 첫 방문 때 자동 저장된 값이 섞여 있어 버리고 새 키를 쓴다

export type Language = 'ko' | 'en'

const STORAGE_KEY = 'dowha:language'
const LEGACY_KEY = 'preferredLanguage'

function isLanguage(value: unknown): value is Language {
  return value === 'ko' || value === 'en'
}

/** 직접 고른 언어 → 브라우저 언어 순으로 결정 (클라이언트 전용) */
export function resolveLanguage(): Language {
  try {
    localStorage.removeItem(LEGACY_KEY)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(stored)) return stored
  } catch {
    // 시크릿 모드 등 저장소를 못 쓰면 브라우저 언어만 사용
  }
  return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

/** 언어 버튼으로 직접 골랐을 때만 호출 */
export function saveLanguage(language: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // 저장 실패는 무시 (이번 방문 동안만 적용)
  }
}
