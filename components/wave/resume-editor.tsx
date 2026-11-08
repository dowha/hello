'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { AutoTextarea, LANGS, PairRow, SaveBar, inputCls, type Lang } from './fields'

type Section = 'info' | 'experience' | 'education' | 'skills'
type TextField = 'title' | 'organization' | 'organization_url' | 'period' | 'country'

type ResumeRow = {
  id: string | null
  language: Lang
  section: Section
  order_index: number
  title: string | null
  organization: string | null
  organization_url: string | null
  period: string | null
  country: string | null
  details: string[] | null
}

/** 같은 섹션·순서의 KO/EN 행을 한 쌍으로 묶어 편집한다 */
type Pair = { key: string; order_index: number; rows: Record<Lang, ResumeRow> }

const SECTIONS: { key: Section; label: string; fields: TextField[]; detailsHint: string }[] = [
  { key: 'info', label: '요약', fields: ['title'], detailsHint: '줄마다 이어 붙여 한 문단으로 표시' },
  {
    key: 'experience',
    label: '경력',
    fields: ['title', 'organization', 'organization_url', 'period'],
    detailsHint: '한 줄 = 한 항목 (HTML 가능)',
  },
  {
    key: 'education',
    label: '학력',
    fields: ['title', 'organization', 'organization_url', 'period', 'country'],
    detailsHint: '한 줄 = 한 항목 (HTML 가능)',
  },
  { key: 'skills', label: '기술', fields: [], detailsHint: '한 줄 = 한 항목, 쉼표로 이어 표시 (HTML 가능)' },
]

const FIELD_LABEL: Record<TextField, string> = {
  title: '제목',
  organization: '기관',
  organization_url: '기관 URL',
  period: '기간',
  country: '국가',
}

const COLS = 'id, language, section, order_index, title, organization, organization_url, period, country, details'

const emptyRow = (language: Lang, section: Section, order_index: number): ResumeRow => ({
  id: null,
  language,
  section,
  order_index,
  title: section === 'info' ? '' : null,
  organization: null,
  organization_url: null,
  period: null,
  country: null,
  details: null,
})

function toPairs(data: ResumeRow[]): Pair[] {
  const map = new Map<string, Pair>()
  for (const r of data) {
    const key = `${r.section}:${r.order_index}`
    const pair = map.get(key) ?? {
      key,
      order_index: r.order_index,
      rows: { ko: emptyRow('ko', r.section, r.order_index), en: emptyRow('en', r.section, r.order_index) },
    }
    pair.rows[r.language] = r
    map.set(key, pair)
  }
  return [...map.values()]
}

export function ResumeEditor() {
  const [section, setSection] = useState<Section>('experience')
  const [pairs, setPairs] = useState<Record<Section, Pair[]> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    supabase
      .from('resume')
      .select(COLS)
      .order('order_index')
      .then(({ data, error }) => {
        if (error) return setError(error.message)
        const rows = (data ?? []) as ResumeRow[]
        setPairs(
          Object.fromEntries(
            SECTIONS.map(({ key }) => [key, toPairs(rows.filter((r) => r.section === key))])
          ) as Record<Section, Pair[]>
        )
      })
  }, [])

  if (error) return <p className="text-xs text-[#c8481c]">{error}</p>
  if (!pairs) return <p className="text-xs text-gray-400">불러오는 중…</p>

  const list = pairs[section]
  const meta = SECTIONS.find((s) => s.key === section)!
  const setList = (fn: (prev: Pair[]) => Pair[]) => setPairs((p) => p && { ...p, [section]: fn(p[section]) })

  const addPair = () => {
    const order_index = list.reduce((m, p) => Math.max(m, p.order_index), -1) + 1
    setList((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        order_index,
        rows: { ko: emptyRow('ko', section, order_index), en: emptyRow('en', section, order_index) },
      },
    ])
  }

  // 위/아래 이동: 두 쌍의 order_index를 맞바꿔 즉시 저장
  const move = async (index: number, dir: -1 | 1) => {
    const a = list[index]
    const b = list[index + dir]
    if (!a || !b) return
    setReordering(true)
    const updates = [
      ...LANGS.map((l) => ({ id: a.rows[l].id, order_index: b.order_index })),
      ...LANGS.map((l) => ({ id: b.rows[l].id, order_index: a.order_index })),
    ].filter((u): u is { id: string; order_index: number } => !!u.id)
    for (const u of updates) {
      const { error } = await supabase.from('resume').update({ order_index: u.order_index }).eq('id', u.id)
      if (error) {
        setReordering(false)
        return setError('순서 변경 실패: ' + error.message)
      }
    }
    setList((prev) => {
      const next = [...prev]
      next[index] = { ...b, order_index: a.order_index }
      next[index + dir] = { ...a, order_index: b.order_index }
      return next
    })
    setReordering(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`rounded-md px-2.5 py-1 ${section === key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {label}
            <span className="ml-1 opacity-60">{pairs[key].length}</span>
          </button>
        ))}
        <button
          onClick={addPair}
          className="ml-auto rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
        >
          + 새 항목
        </button>
      </div>
      <ul className="list-none space-y-3 !pl-0">
        {list.map((pair, i) => (
          <ResumeItem
            key={pair.key}
            pair={pair}
            fields={meta.fields}
            detailsHint={meta.detailsHint}
            canUp={i > 0 && !reordering}
            canDown={i < list.length - 1 && !reordering}
            onMove={(dir) => move(i, dir)}
            onSaved={(rows) => setList((prev) => prev.map((p) => (p.key === pair.key ? { ...p, rows } : p)))}
            onDeleted={() => setList((prev) => prev.filter((p) => p.key !== pair.key))}
          />
        ))}
        {list.length === 0 && <li className="py-8 text-center text-xs text-gray-400">항목이 없습니다.</li>}
      </ul>
    </div>
  )
}

// details 배열 ↔ textarea(줄 단위)
const detailsToText = (d: string[] | null) => (d ?? []).join('\n')
const textToDetails = (t: string) => {
  const lines = t.split('\n').map((s) => s.trim()).filter(Boolean)
  return lines.length ? lines : null
}

function ResumeItem({
  pair,
  fields,
  detailsHint,
  canUp,
  canDown,
  onMove,
  onSaved,
  onDeleted,
}: {
  pair: Pair
  fields: TextField[]
  detailsHint: string
  canUp: boolean
  canDown: boolean
  onMove: (dir: -1 | 1) => void
  onSaved: (rows: Record<Lang, ResumeRow>) => void
  onDeleted: () => void
}) {
  // details는 편집 중 빈 줄을 유지하도록 문자열로 따로 들고 있는다
  const [rows, setRows] = useState(pair.rows)
  const [details, setDetails] = useState<Record<Lang, string>>({
    ko: detailsToText(pair.rows.ko.details),
    en: detailsToText(pair.rows.en.details),
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const isNew = !pair.rows.ko.id && !pair.rows.en.id
  const dirty =
    isNew ||
    LANGS.some(
      (l) =>
        fields.some((f) => (rows[l][f] ?? '') !== (pair.rows[l][f] ?? '')) ||
        JSON.stringify(textToDetails(details[l])) !== JSON.stringify(pair.rows[l].details)
    )

  const setField = (lang: Lang, field: TextField, value: string) => {
    setMessage(null)
    setRows((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }))
  }

  const save = async () => {
    setBusy(true)
    const next = { ...rows }
    for (const lang of LANGS) {
      const r = rows[lang]
      const values = {
        language: lang,
        section: r.section,
        // info.title은 화면에서 빈 문자열로 다루므로 null로 바꾸지 않는다
        ...Object.fromEntries(
          fields.map((f) => [f, (r[f] ?? '').trim() || (r.section === 'info' && f === 'title' ? '' : null)])
        ),
        details: textToDetails(details[lang]),
      }
      // 순서(order_index)는 이동 버튼에서만 바꾼다. 새 행만 현재 순서로 넣는다.
      const { data, error } = r.id
        ? await supabase.from('resume').update(values).eq('id', r.id).select(COLS).single()
        : await supabase.from('resume').insert({ ...values, order_index: pair.order_index }).select(COLS).single()
      if (error) {
        setBusy(false)
        return setMessage({ ok: false, text: `${lang.toUpperCase()} 저장 실패: ${error.message}` })
      }
      next[lang] = data as ResumeRow
    }
    setRows(next)
    onSaved(next)
    setBusy(false)
    setMessage({ ok: true, text: '저장했습니다.' })
  }

  const remove = async () => {
    const ids = LANGS.map((l) => pair.rows[l].id).filter((id): id is string => !!id)
    if (ids.length === 0) return onDeleted()
    if (!window.confirm('KO/EN 두 항목을 함께 삭제할까요?')) return
    setBusy(true)
    const { error } = await supabase.from('resume').delete().in('id', ids)
    setBusy(false)
    if (error) return setMessage({ ok: false, text: '삭제 실패: ' + error.message })
    onDeleted()
  }

  return (
    <li className="space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <span className="truncate text-sm text-gray-800">
          {rows.ko.title || rows.ko.organization || (isNew ? '새 항목' : '(제목 없음)')}
        </span>
        {isNew && <span className="text-[11px] font-medium text-amber-600">새 항목</span>}
        <div className="ml-auto flex shrink-0 gap-1 text-xs text-gray-400">
          <button onClick={() => onMove(-1)} disabled={!canUp || isNew} className="px-1 hover:text-gray-700 disabled:opacity-30" aria-label="위로">
            ↑
          </button>
          <button onClick={() => onMove(1)} disabled={!canDown || isNew} className="px-1 hover:text-gray-700 disabled:opacity-30" aria-label="아래로">
            ↓
          </button>
        </div>
      </div>
      {fields.map((f) => (
        <PairRow
          key={f}
          label={FIELD_LABEL[f]}
          render={(lang) => (
            <input value={rows[lang][f] ?? ''} onChange={(e) => setField(lang, f, e.target.value)} className={inputCls} />
          )}
        />
      ))}
      <PairRow
        label="상세"
        hint={detailsHint}
        render={(lang) => (
          <AutoTextarea
            value={details[lang]}
            onChange={(v) => {
              setMessage(null)
              setDetails((prev) => ({ ...prev, [lang]: v }))
            }}
            minRows={2}
          />
        )}
      />
      <SaveBar dirty={dirty} busy={busy} message={message} onSave={save}>
        <button onClick={remove} disabled={busy} className="text-xs text-gray-400 hover:text-[#c8481c]">
          삭제
        </button>
      </SaveBar>
    </li>
  )
}
