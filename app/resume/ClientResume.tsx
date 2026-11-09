// app/resume/ClientResume.tsx
'use client'

import Resume from '@/components/resume'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { ResumeItem } from '@/lib/site-data'

export default function ClientResume({ data }: { data: ResumeItem[] }) {
  const [language, setLanguage] = usePageLanguage()

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <Resume lang={language} data={data} />
    </>
  )
}
