'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { groupByYear, type HistoryEntry, type Language } from '@/lib/history'

const TITLE: Record<Language, string> = {
  ko: '인생 타임라인',
  en: 'Timeline',
}

function formatMonth(date: string, lang: Language) {
  const [y, m] = date.split('-').map(Number)
  return lang === 'ko'
    ? `${m}월`
    : new Date(y, m - 1).toLocaleString('en-US', { month: 'short' })
}

// 언어 전환 시 재요청하지 않도록 모듈 단위로 캐싱
let cached: Promise<HistoryEntry[]> | null = null

function fetchTimeline() {
  cached ??= Promise.resolve(
    supabase
      .from('timeline')
      .select('id, happened_on, text_ko, text_en')
      .eq('is_published', true)
      .order('happened_on', { ascending: false })
      .order('created_at', { ascending: false })
  ).then(({ data, error }) => {
    if (error) console.error('타임라인 fetch 오류:', error.message)
    return (data as HistoryEntry[] | null) ?? []
  })
  return cached
}

/** 소개 아래에 붙는 연도별 최신순 타임라인 (Supabase timeline 테이블) */
export function History({ language }: { language: Language }) {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)

  useEffect(() => {
    let alive = true
    fetchTimeline().then((rows) => alive && setEntries(rows))
    return () => {
      alive = false
    }
  }, [])

  if (!entries?.length) return null

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="pt-6">
      <h2 id="timeline-title" className="text-sm text-gray-800">
        {TITLE[language]}
      </h2>
      <ol className="list-none">
        {groupByYear(entries).map(({ year, entries }) => (
          <li
            key={year}
            className="grid grid-cols-[auto_1fr] gap-x-2 py-4 border-b border-[#f6f5f4] last:border-b-0"
          >
            <h3 className="text-sm font-normal text-gray-800 tabular-nums pt-px">{year}</h3>
            <ul className="list-none space-y-3">
              {entries.map((entry) => (
                <li key={entry.id} className="flex gap-2 text-sm leading-relaxed">
                  <time
                    dateTime={entry.happened_on.slice(0, 7)}
                    className="w-7 shrink-0 text-right text-xs text-gray-400 tabular-nums pt-[3px]"
                  >
                    {formatMonth(entry.happened_on, language)}
                  </time>
                  <p className="text-gray-700" style={{ wordBreak: 'keep-all' }}>
                    {language === 'ko' ? entry.text_ko : entry.text_en}
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
