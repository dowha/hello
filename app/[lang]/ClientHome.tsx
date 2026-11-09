'use client'

import { About } from '@/components/introduction'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { HomeData } from '@/lib/site-data'
import type { Language } from '@/lib/language'

export default function ClientHome({ language: initial, data }: { language: Language; data: HomeData }) {
  const [language, setLanguage] = usePageLanguage(initial)

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <About language={language} {...data} />
    </>
  )
}
