import ClientHome from './ClientHome'
import { getHomeData } from '@/lib/site-data'
import { profilePageJsonLd, toJsonLdString } from '@/lib/json-ld'
import { languageParams, pageLanguage, type LangParams } from './params'

// 서버에서 데이터를 넣어 그린 페이지를 10분마다 다시 만든다 (/wave 저장 시에는 바로)
export const revalidate = 600
export const dynamicParams = false
export const generateStaticParams = languageParams

export default async function Page(props: LangParams) {
  const [language, data] = await Promise.all([pageLanguage(props), getHomeData()])
  const jsonLd = profilePageJsonLd(language, data.about[language]?.title)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }} />
      <ClientHome language={language} data={data} />
    </>
  )
}
