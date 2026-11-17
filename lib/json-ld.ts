// 구조화 데이터(JSON-LD): 검색엔진이 이 사이트를 '김도화라는 사람의 프로필 페이지'로 이해하도록 돕는다
// blog.dowha.kim(components/JsonLd.tsx)의 작성자 정보(url: https://dowha.kim)와 같은 사람으로 이어진다
import type { Language } from '@/lib/language'

const SITE_URL = 'https://dowha.kim'

// 다른 곳의 같은 사람 프로필 (명령 팔레트 링크와 같은 주소)
const SAME_AS = ['https://blog.dowha.kim', 'https://www.linkedin.com/in/kimdowha/', 'https://lazydesk.studio/']

// DB의 소개 이름은 화면용("DOWHA KIM", "김도화(a.k.a. 파도)")이라 검색용 이름은 따로 둔다
const NAMES: Record<Language, { name: string; alternateName: string[] }> = {
  ko: { name: '김도화', alternateName: ['Dowha Kim', '파도'] },
  en: { name: 'Dowha Kim', alternateName: ['김도화', '파도'] },
}

const FALLBACK_TITLE: Record<Language, string> = { ko: 'B2B SaaS 전문가', en: 'B2B SaaS Specialist' }

/** 홈(프로필 페이지)용. 직함은 /wave에서 고치는 소개(about.title)를 그대로 쓴다 */
export function profilePageJsonLd(language: Language, jobTitle?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: SITE_URL,
    inLanguage: language === 'ko' ? 'ko-KR' : 'en-US',
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      ...NAMES[language],
      jobTitle: jobTitle?.trim() || FALLBACK_TITLE[language],
      url: SITE_URL,
      image: `${SITE_URL}/dowha.png`,
      sameAs: SAME_AS,
    },
  }
}

/** <script type="application/ld+json">에 넣을 문자열. '<'를 이스케이프해 </script>로 태그를 닫는 주입을 막는다 */
export const toJsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
