'use client'

import Link from 'next/link'
import ContactForm from '@/components/contact-form'
import { Wordmark } from '@/components/brand'
import GNB from '@/components/ui/gnb'
import { usePageLanguage } from '@/lib/use-language'
import type { Language } from '@/lib/language'

/** 홈(components/introduction.tsx)과 같은 틀: 맨 위 워드마크(누르면 홈) → 구분선 → 448px 본문 */
export default function ClientContact({ language: initial }: { language: Language }) {
  const [language, setLanguage] = usePageLanguage(initial)

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
          </div>
          {/* 언어를 바꾸면 위젯도 그 언어로 다시 그리도록 key로 새로 만든다 */}
          <ContactForm key={language} lang={language} />
        </div>
      </div>
    </>
  )
}
