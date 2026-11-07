import { HISTORY, groupByYear, type Language } from '@/lib/history'

const TITLE: Record<Language, string> = {
  ko: '타임라인',
  en: 'Timeline',
}

const groups = groupByYear(HISTORY)

function formatMonth(date: string, lang: Language) {
  const [y, m] = date.split('-').map(Number)
  return lang === 'ko'
    ? `${m}월`
    : new Date(y, m - 1).toLocaleString('en-US', { month: 'short' })
}

/** 소개 아래에 붙는 연도별 최신순 타임라인 */
export function History({ language }: { language: Language }) {
  return (
    <section id="history" aria-labelledby="history-title" className="pt-6 border-t border-[#f6f5f4]">
      <h2 id="history-title" className="text-sm text-gray-800">
        {TITLE[language]}
      </h2>
      <ol className="list-none">
        {groups.map(({ year, entries }) => (
          <li
            key={year}
            className="grid grid-cols-[3rem_1fr] gap-x-3 py-4 border-b border-[#f6f5f4] last:border-b-0"
          >
            <h3 className="text-sm font-semibold text-gray-400 tabular-nums pt-px">{year}</h3>
            <ul className="list-none space-y-3">
              {entries.map((entry) => (
                <li key={entry.date + entry.text.en} className="flex gap-3 text-sm leading-relaxed">
                  <time
                    dateTime={entry.date}
                    className="w-9 shrink-0 text-xs text-gray-400 tabular-nums pt-[3px]"
                  >
                    {formatMonth(entry.date, language)}
                  </time>
                  <p className="text-gray-700" style={{ wordBreak: 'keep-all' }}>
                    {entry.text[language]}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
