import { LANGUAGE_PENDING_SCRIPT } from '@/lib/language'

/** 본문보다 먼저 실행돼 영어 방문자에게 한국어가 잠깐 보이지 않게 한다 (서버 컴포넌트) */
export function LanguagePending() {
  return <script dangerouslySetInnerHTML={{ __html: LANGUAGE_PENDING_SCRIPT }} />
}
