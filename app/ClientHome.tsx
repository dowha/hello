'use client'

import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { HomeData } from '@/lib/site-data'

export default function ClientHome({ data }: { data: HomeData }) {
  const [language, setLanguage] = usePageLanguage()

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <About language={language} {...data} />
    </>
  )
}
