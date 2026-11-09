import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'
import { languageParams, openGraphFor, pageLanguage, type LangParams } from './params'

export const dynamicParams = false
export const generateStaticParams = languageParams

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  return { openGraph: openGraphFor(await pageLanguage(props), 'https://dowha.kim') }
}

/** 홈·이력서: 방문자 언어로 미리 만든 페이지라 html lang도 그 언어로 */
export default async function LangLayout({ children, ...props }: LangParams & { children: React.ReactNode }) {
  return <SiteShell lang={await pageLanguage(props)}>{children}</SiteShell>
}
