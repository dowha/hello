// 홈·이력서 데이터를 서버에서 조회한다 (서버 컴포넌트 전용)
import { createClient } from '@supabase/supabase-js'
import type { HistoryEntry, Language } from '@/lib/history'

export type AboutContent = { name: string; title: string; intro: string; journey: string }

export type PostItem = { title: string; slug: string }
export type BookItem = { title: string; author: string; slug: string; volumes?: string | null }
export type ShortItem = { short_id: number; content: string }
export type Highlights = { post: PostItem | null; book: BookItem | null; short: ShortItem | null }

export type ResumeItem = {
  id: string
  language: Language
  section: string // 'info', 'experience', 'education', 'skills'
  title: string
  organization: string | null
  organization_url: string | null
  period: string | null
  details: string[] | null
  order_index: number
  country: string | null
}

export type HomeData = {
  about: Record<Language, AboutContent | null>
  highlights: Highlights
  timeline: HistoryEntry[]
}

// 공개 읽기만 하므로 anon 키 사용. 서버에는 세션 저장소가 없어 세션 유지를 끈다
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// 조회 실패는 빌드·갱신을 멈추지 않도록 로그만 남기고 빈 값으로 그린다
function logError(where: string, error: { message: string } | null) {
  if (error) console.error(`${where} 조회 오류:`, error.message)
}

async function fetchAbout(): Promise<HomeData['about']> {
  const { data, error } = await db.from('about').select('language, name, title, intro, journey')
  logError('소개', error)
  const pick = (lang: Language) => {
    const row = data?.find((r) => r.language === lang)
    return row ? { name: row.name, title: row.title, intro: row.intro, journey: row.journey } : null
  }
  return { ko: pick('ko'), en: pick('en') }
}

async function fetchTimeline(): Promise<HistoryEntry[]> {
  const { data, error } = await db
    .from('timeline')
    .select('id, happened_on, text_ko, text_en')
    .eq('is_published', true)
    .order('happened_on', { ascending: false })
    .order('created_at', { ascending: false })
  logError('타임라인', error)
  return (data as HistoryEntry[] | null) ?? []
}

// 조회 조건은 blog.dowha.kim 홈(pages/index.tsx)과 동일하게 유지
async function fetchHighlights(): Promise<Highlights> {
  const [post, book, short] = await Promise.all([
    // 최근에 쓴 글: 외부 글은 블로그 안에 페이지가 없어 제외
    db
      .from('posts')
      .select('title, slug')
      .eq('is_published', true)
      .eq('is_external', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // 최근에 읽은 책: 감상이 있고 지금 읽는 중이 아닌 책
    db
      .from('books')
      .select('title, author, slug, volumes')
      .not('content', 'is', null)
      .not('is_reading', 'is', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    db
      .from('shorts')
      .select('short_id, content')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])
  logError('최근 글', post.error)
  logError('최근 책', book.error)
  logError('요즘 생각', short.error)
  return {
    post: (post.data as PostItem | null) ?? null,
    book: (book.data as BookItem | null) ?? null,
    short: (short.data as ShortItem | null) ?? null,
  }
}

export async function getHomeData(): Promise<HomeData> {
  const [about, highlights, timeline] = await Promise.all([fetchAbout(), fetchHighlights(), fetchTimeline()])
  return { about, highlights, timeline }
}

export async function getResumeData(): Promise<ResumeItem[]> {
  const { data, error } = await db.from('resume').select('*').order('order_index', { ascending: true })
  logError('이력서', error)
  return (data as ResumeItem[] | null) ?? []
}
