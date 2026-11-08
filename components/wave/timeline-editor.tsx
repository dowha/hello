'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { AutoTextarea, PairRow, SaveBar, StyleHints, inputCls } from './fields'
import { normalizeQuotes } from '@/lib/styleCheck'

type Row = {
  id: string | null // null = 아직 저장 안 된 새 항목
  key: string // 렌더링용 고유 키
  happened_on: string // YYYY-MM-DD (해당 월 1일)
  text_ko: string
  text_en: string
  is_published: boolean
}

const thisMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export function TimelineEditor() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 소유자 정책(owner_read_all)으로 비공개 항목까지 모두 불러온다
    supabase
      .from('timeline')
      .select('id, happened_on, text_ko, text_en, is_published')
      .order('happened_on', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) return setError(error.message)
        setRows((data ?? []).map((r) => ({ ...r, key: r.id })))
      })
  }, [])

  if (error) return <p className="text-xs text-[#c8481c]">{error}</p>
  if (!rows) return <p className="text-xs text-gray-400">불러오는 중…</p>

  const addRow = () =>
    setRows((prev) => [
      { id: null, key: crypto.randomUUID(), happened_on: thisMonth(), text_ko: '', text_en: '', is_published: true },
      ...(prev ?? []),
    ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {rows.length}개 · 홈에서는 연도 최신순, 같은 해는 1월→12월 순으로 보입니다
        </span>
        <button onClick={addRow} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
          + 새 항목
        </button>
      </div>
      <ul className="list-none space-y-3 !pl-0">
        {rows.map((row) => (
          <TimelineItem
            key={row.key}
            initial={row}
            onSaved={(next) => setRows((prev) => prev?.map((r) => (r.key === row.key ? next : r)) ?? null)}
            onDeleted={() => setRows((prev) => prev?.filter((r) => r.key !== row.key) ?? null)}
          />
        ))}
      </ul>
    </div>
  )
}

function TimelineItem({
  initial,
  onSaved,
  onDeleted,
}: {
  initial: Row
  onSaved: (row: Row) => void
  onDeleted: () => void
}) {
  const [row, setRow] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const dirty =
    initial.id === null ||
    (['happened_on', 'text_ko', 'text_en', 'is_published'] as const).some((k) => row[k] !== initial[k])

  const patch = (p: Partial<Row>) => {
    setMessage(null)
    setRow((prev) => ({ ...prev, ...p }))
  }

  const save = async () => {
    if (!row.text_ko.trim() || !row.text_en.trim()) {
      return setMessage({ ok: false, text: 'KO/EN 내용을 모두 입력하세요.' })
    }
    setBusy(true)
    const values = {
      happened_on: row.happened_on,
      // 표기 규칙: 둥근 따옴표는 저장 전에 곧은 따옴표로
      text_ko: normalizeQuotes(row.text_ko.trim()),
      text_en: normalizeQuotes(row.text_en.trim()),
      is_published: row.is_published,
    }
    const { data, error } = row.id
      ? await supabase.from('timeline').update(values).eq('id', row.id).select('id').single()
      : await supabase.from('timeline').insert(values).select('id').single()
    setBusy(false)
    if (error) return setMessage({ ok: false, text: '저장 실패: ' + error.message })
    const next = { ...row, ...values, id: data.id }
    setRow(next)
    onSaved(next)
    setMessage({ ok: true, text: '저장했습니다.' })
  }

  const remove = async () => {
    if (row.id === null) return onDeleted()
    if (!window.confirm('이 항목을 삭제할까요?')) return
    setBusy(true)
    const { error } = await supabase.from('timeline').delete().eq('id', row.id)
    setBusy(false)
    if (error) return setMessage({ ok: false, text: '삭제 실패: ' + error.message })
    onDeleted()
  }

  return (
    <li className={`space-y-3 rounded-lg border p-4 ${row.is_published ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50/60'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="month"
          value={row.happened_on.slice(0, 7)}
          onChange={(e) => e.target.value && patch({ happened_on: `${e.target.value}-01` })}
          className={`${inputCls} !w-auto tabular-nums`}
          aria-label="연월"
        />
        <label className="flex items-center gap-1.5 text-xs text-gray-600">
          <input type="checkbox" checked={row.is_published} onChange={(e) => patch({ is_published: e.target.checked })} />
          공개
        </label>
        {row.id === null && <span className="text-[11px] font-medium text-amber-600">새 항목</span>}
      </div>
      <PairRow
        label="내용"
        render={(lang) => (
          <>
            <AutoTextarea
              value={lang === 'ko' ? row.text_ko : row.text_en}
              onChange={(v) => patch(lang === 'ko' ? { text_ko: v } : { text_en: v })}
            />
            <StyleHints text={lang === 'ko' ? row.text_ko : row.text_en} />
          </>
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
