'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CommandPalette from '@/components/ui/commandpalette'
import { Wordmark } from '@/components/brand'
import { History } from '@/components/history'
import { BlogHighlights } from '@/components/blog-highlights'
import type { HomeData } from '@/lib/site-data'
import type { Language } from '@/lib/language'

// 본문 HTML(회사 링크·로고 칩 포함)은 DB about.journey에서 관리한다
// 예전 원문에 남은 각주 번호(<sup>1</sup>)만 제거
const stripFootnoteMarks = (html: string) =>
  html.replace(/<sup>\s*\d+\s*<\/sup>/g, '')

type AboutProps = HomeData & { language: Language }

/** 데이터는 서버(app/page.tsx)에서 받아 온다 */
export function About({ language, about, highlights, timeline }: AboutProps) {
  const content = about[language]
  const router = useRouter()

  return (
    <div className="main flex flex-col items-center justify-center p-4 pb-12">
      <div className="max-w-md w-full space-y-4">
        <div className="flex flex-col items-center space-y-2 pb-3">
          <Link
            href="/"
            aria-label="Home"
            className="!no-underline transition-opacity hover:opacity-80"
          >
            <Wordmark className="h-6 w-auto text-brand" />
          </Link>
          <span aria-hidden className="block w-8 h-px bg-gray-200 !my-5" />
          {content && (
            <div className="flex flex-col justify-center text-center">
              <h1 className="flex items-center justify-center gap-2">
                <Image
                  src="/dowha.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border border-gray-100 object-cover select-none"
                  priority
                  draggable={false}
                  // 숨은 관리자 진입: 아바타 더블클릭 → /wave (권한은 /wave 로그인 + DB RLS가 확인)
                  onDoubleClick={() => router.push('/wave')}
                />
                {content.name}
              </h1>
              {/* 직함은 부제라 제목 태그가 아니다 (아래 카드 h2와 같은 단계가 되지 않게). 모양은 기존 h2 그대로 */}
              <p className="mt-1 text-sm font-semibold text-gray-600 break-keep sm:text-[15px] md:text-base">{content.title}</p>
              <CommandPalette language={language} />
            </div>
          )}
        </div>
        {content && (
          <>
            <div className="space-y-4 text-left pb-2">
              <p
                className="text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7"
                dangerouslySetInnerHTML={{ __html: content.intro }}
              />
              <p
                className="text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7"
                dangerouslySetInnerHTML={{
                  __html: stripFootnoteMarks(content.journey),
                }}
              />
            </div>
            <BlogHighlights language={language} data={highlights} />
            <History language={language} entries={timeline} />
          </>
        )}
      </div>
    </div>
  )
}
