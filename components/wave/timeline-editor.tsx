'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { AutoTextarea, PairRow, SaveBar, StyleHints } from './fields'
import { normalizeQuotes } from '@/lib/styleCheck'
import { MonthPicker } from '@/components/ui/date-picker'
import ConfirmDialog from './confirm-dialog'
import { BTN_DANGER_SMALL, BTN_SECONDARY } from './ui'

type Row = {
  id: string | null // null = 아직 저장 안 된 새 항목
  key: string // 렌더링용 고유 키
  happened_on: string // YYYY-MM-DD (해당 월 1일)
  text_ko: string
  text_en: string
  is_published: boolean
}

// 브라우저 현지 시각 기준 (toISOString은 UTC라 한국 시간 매달 1일 오전 9시 전엔 지난달이 된다)
const thisMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

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

  if (error) return <p className="text-xs text-warn">{error}</p>
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
        <button onClick={addRow} className={BTN_SECONDARY}>
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
  const [confirmOpen, setConfirmOpen] = useState(false)

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

  // 저장 전 새 항목은 바로 지우고, 저장된 항목은 확인창을 거친다
  const askRemove = () => (row.id === null ? onDeleted() : setConfirmOpen(true))

  const remove = async () => {
    if (row.id === null) return
    setBusy(true)
    const { error } = await supabase.from('timeline').delete().eq('id', row.id)
    setBusy(false)
    if (error) {
      setConfirmOpen(false)
      return setMessage({ ok: false, text: '삭제 실패: ' + error.message })
    }
    onDeleted()
  }

  return (
    <li className={`space-y-3 rounded-lg border p-4 ${row.is_published ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50/60'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <MonthPicker
          value={row.happened_on.slice(0, 7)}
          onChange={(v) => patch({ happened_on: `${v}-01` })}
          title="연월"
          // /wave 입력칸과 같은 크기
          triggerClassName="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-800 outline-none transition-colors hover:border-gray-400 focus-visible:border-gray-400"
        />
        <label className="flex items-center gap-1.5 text-xs text-gray-600">
          <input type="checkbox" checked={row.is_published} onChange={(e) => patch({ is_published: e.target.checked })} />
          공개
        </label>
        {row.id === null && <span className="text-[11px] font-medium text-gray-500">새 항목</span>}
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
        <button onClick={askRemove} disabled={busy} className={BTN_DANGER_SMALL}>
          삭제
        </button>
      </SaveBar>
      <ConfirmDialog
        open={confirmOpen}
        message={'이 항목을 삭제합니다.\n되돌릴 수 없습니다.'}
        confirmLabel="삭제"
        busyLabel="삭제 중…"
        busy={busy}
        danger
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  )
}
