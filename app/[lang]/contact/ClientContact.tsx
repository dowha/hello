'use client'

import ContactForm from '@/components/contact-form'
import Back from '@/components/ui/back'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { Language } from '@/lib/language'

export default function ClientContact({ language: initial }: { language: Language }) {
  const [language, setLanguage] = usePageLanguage(initial)

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <div className="main flex flex-col items-center p-4 pb-12">
        <div className="w-full max-w-md">
          <Back lang={language} />
          {/* 언어를 바꾸면 위젯도 그 언어로 다시 그리도록 key로 새로 만든다 */}
          <ContactForm key={language} lang={language} />
        </div>
      </div>
    </>
  )
}
