'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { checkStyle } from '@/lib/styleCheck'
import { BTN_PRIMARY } from './ui'

// 표기 규칙 원본은 blog에 하나만 둔다
const STYLE_GUIDE_URL = 'https://blog.dowha.kim/style-guide'

export type Lang = 'ko' | 'en'
export const LANGS: Lang[] = ['ko', 'en']
export const LANG_LABEL: Record<Lang, string> = { ko: 'KO', en: 'EN' }

export const inputCls =
  'w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-800 outline-none focus:border-gray-400'

/** 내용 길이에 맞춰 높이가 늘어나는 textarea */
export function AutoTextarea({
  value,
  onChange,
  minRows = 2,
  mono,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  minRows?: number
  mono?: boolean
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const fit = () => {
    const el = ref.current
    // 숨김 탭 안에서는 scrollHeight가 0이라 높이를 건드리지 않는다
    if (!el || el.offsetParent === null) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }

  useEffect(fit, [value])

  // 숨김 탭이 보이게 되거나 창 너비가 바뀌면(줄바꿈 변화) 다시 맞춘다
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let width = -1
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return
      width = entry.contentRect.width
      fit()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-none leading-relaxed ${mono ? 'font-mono text-xs' : ''}`}
    />
  )
}

/** 한 필드를 KO | EN 두 칸으로 나란히 보여주는 행 (모바일에선 위아래) */
export function PairRow({
  label,
  hint,
  render,
}: {
  label: string
  hint?: string
  render: (lang: Lang) => ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {LANGS.map((lang) => (
          <div key={lang} className="min-w-0 space-y-1">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400">
              {LANG_LABEL[lang]}
            </span>
            {render(lang)}
          </div>
        ))}
      </div>
    </div>
  )
}

/** 저장 버튼 + 결과 메시지 */
export function SaveBar({
  dirty,
  busy,
  message,
  onSave,
  children,
}: {
  dirty: boolean
  busy: boolean
  message?: { ok: boolean; text: string } | null
  onSave: () => void
  children?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      {children}
      {message && (
        <span className={`text-xs ${message.ok ? 'text-brand-dark' : 'text-warn'}`}>
          {message.text}
        </span>
      )}
      <button
        onClick={onSave}
        disabled={!dirty || busy}
        className={`ml-auto ${BTN_PRIMARY}`}
      >
        {busy ? '저장 중…' : '저장'}
      </button>
    </div>
  )
}

/** 표기 규칙 위반 후보. 없으면 아무것도 그리지 않는다 (저장은 막지 않음) */
export function StyleHints({ text, headline }: { text: string; headline?: boolean }) {
  const issues = checkStyle(text, { headline })
  if (!issues.length) return null
  return (
    // blog /desk 표기 확인과 같은 형태: 걸린 문구 / [규칙] 설명
    <ul className="list-none space-y-1.5 !pl-0 text-[11px]">
      {issues.map((i, idx) => (
        <li key={idx}>
          <span className="block text-gray-800">{i.excerpt}</span>
          <span className="block text-gray-400">
            <span className="font-medium text-warn">[{i.rule}]</span> {i.message}{' '}
            <a href={STYLE_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
              규칙 ↗
            </a>
          </span>
        </li>
      ))}
    </ul>
  )
}
