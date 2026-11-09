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

/** 영어로 보일 방문자는 언어가 정해질 때까지 본문을 숨긴다 (서버는 한국어로 그리므로 한국어가 잠깐 보이는 것을 막음) */
export const LANGUAGE_PENDING_ATTR = 'data-lang-pending'

/** resolveLanguage와 같은 규칙을 화면이 그려지기 전에 실행하는 인라인 스크립트 */
export const LANGUAGE_PENDING_SCRIPT = `(function(){var l;try{l=localStorage.getItem('${STORAGE_KEY}')}catch(e){}if(l!=='ko'&&l!=='en')l=navigator.language.toLowerCase().indexOf('ko')===0?'ko':'en';if(l!=='ko')document.documentElement.setAttribute('${LANGUAGE_PENDING_ATTR}','')})()`
