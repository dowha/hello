import { Metadata } from 'next'
import ClientContact from './ClientContact'
import { languageParams, openGraphFor, pageLanguage, type LangParams } from '../params'

// 연락 폼 (DO-81). 데이터가 없는 정적 페이지라 언어별로 미리 만든다
export const dynamicParams = false
export const generateStaticParams = languageParams

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const lang = await pageLanguage(props)
  const canonicalUrl = 'https://dowha.kim/contact'
  return {
    title: lang === 'ko' ? '연락하기' : 'Contact',
    description: lang === 'ko' ? '김도화에게 메시지 보내기' : 'Send a message to Dowha Kim',
    alternates: { canonical: canonicalUrl },
    openGraph: openGraphFor(lang, canonicalUrl),
  }
}

export default async function ContactPage(props: LangParams) {
  return <ClientContact language={await pageLanguage(props)} />
}
