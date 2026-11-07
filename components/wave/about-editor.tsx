'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase'
import { AutoTextarea, LANGS, PairRow, SaveBar, inputCls, type Lang } from './fields'

type AboutRow = { id: string; language: Lang; name: string; title: string; intro: string; journey: string }
type Field = 'name' | 'title' | 'intro' | 'journey'

const FIELDS: { key: Field; label: string; hint?: string; html?: boolean }[] = [
  { key: 'name', label: '이름' },
  { key: 'title', label: '타이틀' },
  { key: 'intro', label: '소개', hint: 'HTML 가능 · 강조는 <em class="wave">', html: true },
  {
    key: 'journey',
    label: '본문',
    hint: 'HTML 가능 · 회사 링크는 <a class="company"> + <img class="company-chip">',
    html: true,
  },
]

export function AboutEditor() {
  const [rows, setRows] = useState<Record<Lang, AboutRow> | null>(null)
  const [saved, setSaved] = useState<Record<Lang, AboutRow> | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [preview, setPreview] = useState(true)

  useEffect(() => {
    supabase
      .from('about')
      .select('id, language, name, title, intro, journey')
      .then(({ data, error }) => {
        if (error) return setMessage({ ok: false, text: error.message })
        const map = Object.fromEntries((data ?? []).map((r) => [r.language, r])) as Record<Lang, AboutRow>
        setRows(map)
        setSaved(map)
      })
  }, [])

  if (!rows || !saved) return <p className="text-xs text-gray-400">불러오는 중…</p>

  const changed = LANGS.filter((l) => FIELDS.some(({ key }) => rows[l][key] !== saved[l][key]))

  const set = (lang: Lang, key: Field, value: string) => {
    setMessage(null)
    setRows((prev) => prev && { ...prev, [lang]: { ...prev[lang], [key]: value } })
  }

  const save = async () => {
    setBusy(true)
    for (const lang of changed) {
      const { id, name, title, intro, journey } = rows[lang]
      const { error } = await supabase.from('about').update({ name, title, intro, journey }).eq('id', id)
      if (error) {
        setBusy(false)
        return setMessage({ ok: false, text: `${lang.toUpperCase()} 저장 실패: ${error.message}` })
      }
    }
    setSaved(rows)
    setBusy(false)
    setMessage({ ok: true, text: '저장했습니다.' })
  }

  return (
    <div className="space-y-6">
      {FIELDS.map(({ key, label, hint, html }) => (
        <PairRow
          key={key}
          label={label}
          hint={hint}
          render={(lang) =>
            html ? (
              <>
                <AutoTextarea value={rows[lang][key]} onChange={(v) => set(lang, key, v)} mono minRows={3} />
                {preview && (
                  // 실제 페이지와 같은 스타일(.main)로 미리보기
                  <div
                    className="main rounded-md bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{ __html: rows[lang][key] }}
                  />
                )}
              </>
            ) : (
              <input value={rows[lang][key]} onChange={(e) => set(lang, key, e.target.value)} className={inputCls} />
            )
          }
        />
      ))}
      <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-white/90 px-4 py-3 backdrop-blur">
        <SaveBar dirty={changed.length > 0} busy={busy} message={message} onSave={save}>
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} />
            미리보기
          </label>
        </SaveBar>
      </div>
    </div>
  )
}
