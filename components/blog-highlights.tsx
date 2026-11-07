'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/supabase'

type Language = 'ko' | 'en'
type PostItem = { title: string; slug: string }
type BookItem = { title: string; author: string; slug: string }
type ShortItem = { short_id: number; content: string }
type Highlights = { post: PostItem | null; book: BookItem | null; short: ShortItem | null }

const BLOG = 'https://blog.dowha.kim'

const COPY: Record<Language, { post: string; book: string; short: string; blog: string }> = {
  ko: {
    post: '최근에 쓴 글',
    book: '최근에 읽은 책',
    short: '요즘 하는 생각',
    blog: '블로그 바로가기',
  },
  en: {
    post: 'Latest writing',
    book: 'Recently read',
    short: 'What I’m thinking lately',
    blog: 'Visit the blog',
  },
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

// 조회 조건은 blog.dowha.kim 홈(pages/index.tsx)과 동일하게 유지
async function fetchHighlights(): Promise<Highlights> {
  const [post, book, short] = await Promise.all([
    // 최근에 쓴 글: 외부 글은 블로그 안에 페이지가 없어 제외
    supabase
      .from('posts')
      .select('title, slug')
      .eq('is_published', true)
      .eq('is_external', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // 최근에 읽은 책: 감상이 있고 지금 읽는 중이 아닌 책
    supabase
      .from('books')
      .select('title, author, slug')
      .not('content', 'is', null)
      .not('is_reading', 'is', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('shorts')
      .select('short_id, content')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  for (const { error } of [post, book, short]) {
    if (error) console.error('블로그 하이라이트 fetch 오류:', error.message)
  }
  return {
    post: (post.data as PostItem | null) ?? null,
    book: (book.data as BookItem | null) ?? null,
    short: (short.data as ShortItem | null) ?? null,
  }
}

// 언어 전환 시 재요청하지 않도록 모듈 단위로 캐싱
let cached: Promise<Highlights> | null = null

function Card({ emoji, title, children }: { emoji: string; title: string; children: ReactNode }) {
  return (
    <section className="py-2.5">
      <h2 className="text-sm text-gray-800">
        <span className="mr-1">{emoji}</span> {title}
      </h2>
      {children}
    </section>
  )
}

/** blog.dowha.kim 홈처럼 최근 글·읽은 책·요즘 하는 생각을 보여준다 */
export function BlogHighlights({ language }: { language: Language }) {
  const [data, setData] = useState<Highlights | null>(null)
  const copy = COPY[language]

  useEffect(() => {
    let alive = true
    cached ??= fetchHighlights()
    cached.then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])

  if (!data) return null
  const { post, book, short } = data

  return (
    <div className="bg-gray-100 px-3 rounded-lg divide-y divide-gray-200">
      {post && (
        <Card emoji="🌱" title={copy.post}>
          <a
            href={`${BLOG}/posts/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 mb-1 text-sm"
          >
            {post.title}
          </a>
        </Card>
      )}

      {book && (
        <Card emoji="📖" title={copy.book}>
          <a
            href={`${BLOG}/books/${book.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 mb-1 text-sm"
          >
            “{book.title}”, {book.author}
          </a>
        </Card>
      )}

      {short && (
        <Card emoji="💭" title={copy.short}>
          <a
            href={`${BLOG}/shorts#${short.short_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-2 mb-1 ml-4 inline-block max-w-[85%] rounded-3xl bg-white px-4 py-2 text-sm leading-relaxed text-gray-600 !no-underline whitespace-pre-wrap transition-colors hover:bg-gray-50 hover:!text-gray-600 after:!hidden"
          >
            {renderEmphasis(short.content)}
            <span className="absolute -left-2 bottom-3 h-4 w-4 rounded-full bg-inherit" />
            <span className="absolute -left-4 bottom-1 h-2 w-2 rounded-full bg-inherit" />
          </a>
        </Card>
      )}

      <div className="py-2 text-right text-xs">
        <a
          href={BLOG}
          target="_blank"
          rel="noopener noreferrer"
          className="!no-underline text-gray-500 after:!hidden"
        >
          {copy.blog} →
        </a>
      </div>
    </div>
  )
}
