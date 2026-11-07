// 타임라인 항목은 Supabase `timeline` 테이블에서 관리한다
// (happened_on: 해당 월 1일, text_ko/text_en, is_published)

export type Language = 'ko' | 'en'

export type HistoryEntry = {
  id: string
  /** YYYY-MM-DD (해당 월 1일) */
  happened_on: string
  text_ko: string
  text_en: string
}

/** 연도별로 묶어 반환: 연도는 최신순, 같은 해 안에서는 1월 → 12월 순 */
export function groupByYear(entries: HistoryEntry[]) {
  const sorted = [...entries].sort((a, b) => {
    const byYear = b.happened_on.slice(0, 4).localeCompare(a.happened_on.slice(0, 4))
    return byYear || a.happened_on.localeCompare(b.happened_on)
  })
  const groups: { year: string; entries: HistoryEntry[] }[] = []
  for (const entry of sorted) {
    const year = entry.happened_on.slice(0, 4)
    const last = groups[groups.length - 1]
    if (last?.year === year) last.entries.push(entry)
    else groups.push({ year, entries: [entry] })
  }
  return groups
}
