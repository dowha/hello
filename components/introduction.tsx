'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CommandPalette from '@/components/ui/commandpalette'
import { Wordmark } from '@/components/brand'
import { History } from '@/components/history'
import { BlogHighlights } from '@/components/blog-highlights'
import { Spinner } from '@/components/ui/spinner'
import { supabase } from '@/supabase' // supabase.ts에서 클라이언트 가져오기

// 데이터 타입 정의
type AboutContent = {
  name: string
  title: string
  intro: string
  journey: string
}

// 본문 HTML(회사 링크·로고 칩 포함)은 DB about.journey에서 관리한다
// 예전 원문에 남은 각주 번호(<sup>1</sup>)만 제거
const stripFootnoteMarks = (html: string) =>
  html.replace(/<sup>\s*\d+\s*<\/sup>/g, '')

type AboutProps = {
  language: 'en' | 'ko'
}

// 캐싱을 위한 Map 객체 생성
const cache = new Map<string, AboutContent>()

export function About({ language }: AboutProps) {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true) // 로딩 상태 추가
  const router = useRouter()

  async function fetchAboutContent(lang: 'en' | 'ko') {
    if (cache.has(lang)) {
      setContent(cache.get(lang)!)
      return
    }

    const { data, error } = await supabase
      .from('about')
      .select('name, title, intro, journey')
      .eq('language', lang)
      .single()
    if (error) {
      console.error('Error fetching data:', error.message)
      setLoading(false) // 에러 발생 시 로딩 종료
      return
    }

    cache.set(lang, data)
    setContent(data)
    setLoading(false) // 데이터 로드 완료 시 로딩 종료
  }

  useEffect(() => {
    fetchAboutContent(language)
  }, [language])

  // 로고·구분선은 먼저 보여주고, 내용 자리에서만 로딩 표시
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
              <h2 className="mt-1 text-sm md:text-base">{content.title}</h2>
              <CommandPalette language={language} />
            </div>
          )}
        </div>
        {!content ? (
          loading && <Spinner className="min-h-[300px]" />
        ) : (
          <>
            <div className="space-y-4 text-left pb-2">
              <p
                className="text-sm leading-6 md:text-base md:leading-7"
                dangerouslySetInnerHTML={{ __html: content.intro }}
              />
              <p
                className="text-sm leading-6 md:text-base md:leading-7"
                dangerouslySetInnerHTML={{
                  __html: stripFootnoteMarks(content.journey),
                }}
              />
            </div>
            <BlogHighlights language={language} />
            <History language={language} />
          </>
        )}
      </div>
    </div>
  )
}
