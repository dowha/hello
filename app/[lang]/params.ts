import { LANGUAGES, isLanguage, type Language } from '@/lib/language'

// 한국어·영어 페이지를 미리 만든다. 방문자 주소는 / · /resume 그대로이고 middleware.ts가 언어에 맞게 연결한다
export const languageParams = () => LANGUAGES.map((lang) => ({ lang }))

export type LangParams = { params: Promise<{ lang: string }> }

export async function pageLanguage({ params }: LangParams): Promise<Language> {
  const { lang } = await params
  return isLanguage(lang) ? lang : 'ko'
}

// 하위 페이지에서 openGraph를 지정하면 상위 값이 통째로 바뀌므로 언어·이미지를 함께 넣는다
export const openGraphFor = (lang: Language, url: string) => ({
  type: 'website' as const,
  url,
  locale: lang === 'ko' ? 'ko_KR' : 'en_US',
  images: [{ url: '/opengraph-image.png?v=2', width: 2400, height: 1260, alt: 'dowha kim — B2B SaaS Specialist' }],
})
