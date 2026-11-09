'use client'

import type { ReactNode } from 'react'
import type { Language } from '@/lib/language'
import type { Highlights } from '@/lib/site-data'

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
    short: "What I'm thinking lately",
    blog: 'Visit the blog',
  },
}

// 책 제목 표기: 국문 《 》, 영문은 이탤릭. 한글 제목은 기울이면 어색해 영문 모드에서도 《 》 유지
const HANGUL = /[\u3131-\u318e\uac00-\ud7a3]/

function BookTitle({ title, language }: { title: string; language: Language }) {
  return language === 'en' && !HANGUL.test(title) ? <i>{title}</i> : <>《{title}》</>
}

// shorts는 굵게·기울임만 쓰므로 react-markdown 대신 간단히 변환 (blog 홈과 동일)
function renderEmphasis(text: string) {
  return text
    .split(/(==(?=\S)[^=\n]*?\S==|\*\*[^*\n]+\*\*|(?<!\w)__[^_\n]+__(?!\w)|\*[^*\n]+\*|(?<!\w)_[^_\n]+_(?!\w))/g)
    .map((part, i) => {
      if (/^==.+==$/.test(part)) return <mark key={i}>{part.slice(2, -2)}</mark>
      if (/^(\*\*|__).+\1$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>
      if (/^([*_]).+\1$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
      return part
    })
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-2.5">
      <h2 className="text-sm text-gray-800">{title}</h2>
      {children}
    </section>
  )
}

/** blog.dowha.kim 홈처럼 최근 글·읽은 책·요즘 하는 생각을 보여준다 (조회는 lib/site-data.ts) */
export function BlogHighlights({ language, data }: { language: Language; data: Highlights }) {
  const copy = COPY[language]
  const { post, book, short } = data

  return (
    <div className="bg-gray-100 px-3 rounded-lg divide-y divide-gray-200">
      {post && (
        <Card title={copy.post}>
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
        <Card title={copy.book}>
          <a
            href={`${BLOG}/books/${book.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 mb-1 text-sm"
          >
            <BookTitle title={book.title} language={language} />
            {book.volumes && `(${book.volumes})`}, {book.author}
          </a>
        </Card>
      )}

      {short && (
        <Card title={copy.short}>
          <a
            href={`${BLOG}/shorts#${short.short_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 mb-1 ml-4 flex items-end gap-1 !no-underline after:!hidden"
          >
            <span className="relative max-w-[85%] rounded-3xl bg-white px-4 py-2 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap transition-colors group-hover:bg-gray-50">
              {renderEmphasis(short.content)}
              <span className="absolute -left-2 bottom-3 h-4 w-4 rounded-full bg-inherit" />
              <span className="absolute -left-4 bottom-1 h-2 w-2 rounded-full bg-inherit" />
            </span>
            {/* 다른 외부 링크와 같은 ↗ 표시 (말풍선 오른쪽 아래) */}
            <span aria-hidden className="pb-1 text-sm text-gray-300 transition-colors group-hover:text-brand">
              ↗
            </span>
          </a>
        </Card>
      )}

      <div className="py-2 text-right text-xs">
        {/* 블로그 바로가기: 새 탭으로 열되 ↗ 대신 → 화살표만 쓴다 */}
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
