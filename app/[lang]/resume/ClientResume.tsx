'use client'

import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { ResumeItem } from '@/lib/site-data'
import type { Language } from '@/lib/language'

export default function ClientResume({ language: initial, data }: { language: Language; data: ResumeItem[] }) {
  const [language, setLanguage] = usePageLanguage(initial)

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <Resume lang={language} data={data} />
    </>
  )
}
