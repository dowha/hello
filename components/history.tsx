'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { groupByYear, type HistoryEntry, type Language } from '@/lib/history'

const TITLE: Record<Language, string> = {
  ko: '인생 타임라인',
  en: 'Life Timeline',
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

const MORE: Record<Language, string> = {
  ko: '이벤트 더 보기',
  en: 'Show more events',
}

// 접힌 상태에서 앞(최근)·뒤(가장 오래된)로 보여줄 연도 수
const HEAD_YEARS = 3
const TAIL_YEARS = 2

// 접힌 경계의 연도는 가운데 쪽으로 흐려지게
const FADE_DOWN = '[mask-image:linear-gradient(to_bottom,black_20%,transparent)]'
const FADE_UP = '[mask-image:linear-gradient(to_top,black_20%,transparent)]'

// 영문 작품명(대분류) 이탤릭 표기용: *제목* → <i>제목</i>
function renderItalic(text: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <i key={i}>{part}</i> : part))
}

type YearGroup = ReturnType<typeof groupByYear>[number]

function YearRow({ group, language, className = '' }: { group: YearGroup; language: Language; className?: string }) {
  return (
    <li className={`grid grid-cols-[auto_1fr] gap-x-2 py-4 border-b border-[#f6f5f4] last:border-b-0 ${className}`}>
      <h3 className="text-sm font-normal text-gray-800 tabular-nums pt-px">{group.year}</h3>
      <ul className="list-none space-y-3">
        {group.entries.map((entry) => (
          <li key={entry.id} className="flex gap-2 text-sm leading-relaxed">
            <time
              dateTime={entry.happened_on.slice(0, 7)}
              className="w-7 shrink-0 text-right text-xs text-gray-400 tabular-nums pt-[3px]"
            >
              {formatMonth(entry.happened_on, language)}
            </time>
            <p className="text-gray-700" style={{ wordBreak: 'keep-all' }}>
              {renderItalic(language === 'ko' ? entry.text_ko : entry.text_en)}
            </p>
          </li>
        ))}
      </ul>
    </li>
  )
}

/** 소개 아래에 붙는 연도별 최신순 타임라인 (Supabase timeline 테이블). 가운데는 접어 두고 클릭 시 전체 표시 */
export function History({ language }: { language: Language }) {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let alive = true
    fetchTimeline().then((rows) => alive && setEntries(rows))
    return () => {
      alive = false
    }
  }, [])

  if (!entries?.length) return null

  const groups = groupByYear(entries)
  // 숨길 연도가 2개 이상일 때만 접는다 (1개만 숨기면 버튼이 더 자리를 차지함)
  const collapsible = groups.length > HEAD_YEARS + TAIL_YEARS + 1
  const collapsed = collapsible && !expanded
  const head = collapsed ? groups.slice(0, HEAD_YEARS) : groups
  const tail = collapsed ? groups.slice(-TAIL_YEARS) : []

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="pt-6">
      <h2 id="timeline-title" className="text-sm text-gray-800">
        {TITLE[language]}
      </h2>
      <ol className="list-none">
        {head.map((group, i) => (
          <YearRow
            key={group.year}
            group={group}
            language={language}
            className={collapsed && i === head.length - 1 ? `${FADE_DOWN} !border-b-0` : ''}
          />
        ))}
        {collapsed && (
          <li className="flex justify-center py-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-expanded={false}
              aria-controls="timeline"
              className="flex flex-col items-center gap-1 text-xs text-gray-400 transition-colors hover:text-brand"
            >
              <span aria-hidden className="leading-none tracking-widest">⋮</span>
              {MORE[language]}
              <span aria-hidden className="leading-none tracking-widest">⋮</span>
            </button>
          </li>
        )}
        {tail.map((group, i) => (
          <YearRow
            key={group.year}
            group={group}
            language={language}
            className={i === 0 ? FADE_UP : ''}
          />
        ))}
      </ol>
    </section>
  )
}
