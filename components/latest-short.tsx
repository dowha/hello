'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'

type ShortItem = { short_id: number; content: string }
type Language = 'ko' | 'en'

const TITLE: Record<Language, string> = {
  ko: '요즘 하는 생각',
  en: 'What I’m thinking lately',
}

// shorts는 굵게·기울임만 쓰므로 react-markdown 대신 간단히 변환 (blog 홈과 동일)
function renderEmphasis(text: string) {
  return text
    .split(/(\*\*[^*\n]+\*\*|(?<!\w)__[^_\n]+__(?!\w)|\*[^*\n]+\*|(?<!\w)_[^_\n]+_(?!\w))/g)
    .map((part, i) => {
      if (/^(\*\*|__).+\1$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>
      if (/^([*_]).+\1$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
      return part
    })
}

// 언어 전환 시 재요청하지 않도록 모듈 단위로 캐싱
let cached: Promise<ShortItem | null> | null = null

function fetchLatestShort() {
  cached ??= Promise.resolve(
    supabase
      .from('shorts')
      .select('short_id, content')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  ).then(({ data, error }) => {
    if (error) console.error('최신 short fetch 오류:', error.message)
    return (data as ShortItem | null) ?? null
  })
  return cached
}

/** blog.dowha.kim 홈의 '💭 요즘 하는 생각'과 같은 최신 short 말풍선 */
export function LatestShort({ language }: { language: Language }) {
  const [short, setShort] = useState<ShortItem | null>(null)

  useEffect(() => {
    let alive = true
    fetchLatestShort().then((s) => alive && setShort(s))
    return () => {
      alive = false
    }
  }, [])

  if (!short) return null

  return (
    <section className="bg-gray-100 py-2 px-3 rounded-lg">
      <h2 className="text-sm text-gray-800">
        <span className="mr-1">💭</span> {TITLE[language]}
      </h2>
      <a
        href={`https://blog.dowha.kim/shorts#${short.short_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-2 mb-2 ml-4 inline-block max-w-[85%] rounded-3xl bg-white px-4 py-2 text-sm leading-relaxed text-gray-600 !no-underline whitespace-pre-wrap transition-colors hover:bg-gray-50 hover:!text-gray-600 after:!hidden"
      >
        {renderEmphasis(short.content)}
        <span className="absolute -left-2 bottom-3 h-4 w-4 rounded-full bg-inherit" />
        <span className="absolute -left-4 bottom-1 h-2 w-2 rounded-full bg-inherit" />
      </a>
    </section>
  )
}
