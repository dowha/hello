'use client'

import { useEffect, useState } from 'react'
import GNB from '@/components/ui/gnb'
import { Logomark } from '@/components/brand'
import { HISTORY, groupByYear, type Language } from '@/lib/history'

const COPY: Record<Language, { title: string; lead: string }> = {
  ko: {
    title: '도화의 역사',
    lead: '어쩌다 여기까지 왔는지 적어두는 기록. 최신순.',
  },
  en: {
    title: 'The History of Dowha',
    lead: 'A running log of how I got here. Newest first.',
  },
}

const groups = groupByYear(HISTORY)

function formatMonth(date: string, lang: Language) {
  const [y, m] = date.split('-').map(Number)
  return lang === 'ko'
    ? `${m}월`
    : new Date(y, m - 1).toLocaleString('en-US', { month: 'short' })
}

export default function ClientHistory() {
  // 서버/클라이언트 언어 불일치를 막기 위해 마운트 후 결정
  const [language, setLanguage] = useState<Language | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('preferredLanguage') as Language | null
    setLanguage(stored ?? (navigator.language.startsWith('ko') ? 'ko' : 'en'))
  }, [])

  const lang = language ?? 'ko'
  const copy = COPY[lang]

  return (
    <>
      <GNB showLanguage showTheme={false} currentLanguage={lang} onLanguageChange={setLanguage} />
      <main
        className={`main flex justify-center px-4 pb-20 transition-opacity duration-200 ${
          language ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-md w-full">
          <header className="flex items-center gap-3 pt-4 pb-6 border-b border-[#f6f5f4]">
            <Logomark className="w-8 h-8 text-brand shrink-0" aria-hidden />
            <div>
              <h1>{copy.title}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{copy.lead}</p>
            </div>
          </header>

          <ol className="list-none">
            {groups.map(({ year, entries }) => (
              <li key={year} className="grid grid-cols-[3.5rem_1fr] gap-x-3 py-5 border-b border-[#f6f5f4]">
                <h2 className="text-sm font-semibold text-gray-400 tabular-nums pt-px">{year}</h2>
                <ul className="list-none space-y-3">
                  {entries.map((entry) => (
                    <li key={entry.date + entry.text.en} className="flex gap-3 text-sm leading-relaxed">
                      <time
                        dateTime={entry.date}
                        className="w-9 shrink-0 text-xs text-gray-400 tabular-nums pt-[3px]"
                      >
                        {formatMonth(entry.date, lang)}
                      </time>
                      <p className="text-gray-700" style={{ wordBreak: 'keep-all' }}>
                        {entry.emoji && <span className="mr-1.5">{entry.emoji}</span>}
                        {entry.text[lang]}
                        {entry.url && (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 !no-underline text-gray-400 after:!hidden"
                            aria-label={lang === 'ko' ? '관련 링크' : 'Related link'}
                          >
                            →
                          </a>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </>
  )
}
