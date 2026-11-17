'use client'

import Link from 'next/link'
import ContactForm, { CONTACT_TEXT } from '@/components/contact-form'
import { Wordmark } from '@/components/brand'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { Language } from '@/lib/language'

/** 홈(components/introduction.tsx)과 같은 틀: 워드마크(누르면 홈) → 구분선 → 제목·부제 → 448px 본문 */
export default function ClientContact({ language: initial }: { language: Language }) {
  const [language, setLanguage] = usePageLanguage(initial)
  const t = CONTACT_TEXT[language]

  return (
    <>
      <GNB showLanguage={true} currentLanguage={language} onLanguageChange={setLanguage} />
      <div className="main flex flex-col items-center justify-center p-4 pb-12">
        <div className="max-w-md w-full space-y-4">
          <div className="flex flex-col items-center space-y-2 pb-3">
            <Link href="/" aria-label="Home" className="!no-underline transition-opacity hover:opacity-80">
              <Wordmark className="h-6 w-auto text-brand" />
            </Link>
            <span aria-hidden className="block w-8 h-px bg-gray-200 !my-5" />
            <div className="flex flex-col justify-center text-center">
              <h1>{t.title}</h1>
              {/* 홈 직함과 같은 크기·색. 문장이라 굵기만 보통으로 둔다 */}
              <p className="mt-1 text-sm text-gray-600 break-keep sm:text-[15px] md:text-base">{t.lead}</p>
            </div>
          </div>
          {/* 언어를 바꾸면 위젯도 그 언어로 다시 그리도록 key로 새로 만든다 */}
          <ContactForm key={language} lang={language} />
        </div>
      </div>
    </>
  )
}
