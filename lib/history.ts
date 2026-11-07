// History of Dowha 타임라인 데이터
// - 최신 항목을 위에 두고 날짜(YYYY-MM)로 정렬된다 (순서는 자동 정렬되므로 아무 데나 추가해도 됨)
// - 개인적인 사건(이사, 반려동물, 취미 등)도 자유롭게 추가할 것

export type Language = 'ko' | 'en'

export type HistoryEntry = {
  /** YYYY-MM */
  date: string
  text: Record<Language, string>
}

export const HISTORY: HistoryEntry[] = [
  {
    date: '2023-12',
    text: {
      ko: '파수 클라우드서비스팀에 합류. 마케터에서 PM으로 직무를 바꿨다.',
      en: 'Joined Fasoo’s cloud service team. Switched from marketer to product manager.',
    },
  },
  {
    date: '2023-11',
    text: {
      ko: '3년 넘게 다닌 잔디를 떠남.',
      en: 'Left JANDI after three-plus years.',
    },
  },
  {
    date: '2020-08',
    text: {
      ko: '토스랩(잔디)에서 콘텐츠 마케터로 B2B SaaS 세계에 입문.',
      en: 'Entered the B2B SaaS world as a content marketer at Toss Lab (JANDI).',
    },
  },
  {
    date: '2018-10',
    text: {
      ko: '일가 아시아(ILGA Asia)에서 커뮤니케이션·회원관리 담당. 월간 뉴스레터를 처음부터 만들었다.',
      en: 'Communications & membership at ILGA Asia. Started a monthly newsletter from scratch.',
    },
  },
  {
    date: '2016-10',
    text: {
      ko: '세이브더칠드런 미디어커뮤니케이션팀에서 첫 직장 생활 시작.',
      en: 'First job: media communications at Save the Children Korea.',
    },
  },
  {
    date: '2017-01',
    text: {
      ko: '요크 대학교 국제인권법 석사(LLM) 졸업.',
      en: 'Finished an LLM in International Human Rights Law at the University of York.',
    },
  },
  {
    date: '2015-09',
    text: {
      ko: '영국 요크로 유학.',
      en: 'Moved to York, UK for grad school.',
    },
  },
  {
    date: '2015-02',
    text: {
      ko: '연세대학교 정치외교학과 졸업. 7년 걸렸다.',
      en: 'Graduated from Yonsei University (Political Science). Took seven years.',
    },
  },
  {
    date: '2013-03',
    text: {
      ko: '독일 포르츠하임 대학교에서 경영학 교환학생.',
      en: 'Exchange semester in business at Hochschule Pforzheim, Germany.',
    },
  },
  {
    date: '2008-03',
    text: {
      ko: '연세대학교 입학. 교지 『연세』 편집위원회에서 글쓰기를 배웠다.',
      en: 'Started at Yonsei University. Learned to write at the campus journal <Yonsei>.',
    },
  },
]

/** 연도별로 묶어 최신순으로 반환 */
export function groupByYear(entries: HistoryEntry[]) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const groups: { year: string; entries: HistoryEntry[] }[] = []
  for (const entry of sorted) {
    const year = entry.date.slice(0, 4)
    const last = groups[groups.length - 1]
    if (last?.year === year) last.entries.push(entry)
    else groups.push({ year, entries: [entry] })
  }
  return groups
}
