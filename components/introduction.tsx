'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import CommandPalette from '@/components/ui/commandpalette'
import { Wordmark } from '@/components/brand'
import { History } from '@/components/history'
import { BlogHighlights } from '@/components/blog-highlights'
import { supabase } from '@/supabase' // supabase.ts에서 클라이언트 가져오기

// 데이터 타입 정의
type AboutContent = {
  name: string
  title: string
  intro: string
  journey: string
}

// 본문(DB) 문장을 로고 칩이 붙은 회사 링크로 바꾼다
// - 파수·토스랩: 회사명+각주 번호(예: 파수<sup>1</sup>)를 찾아 링크로 교체
// - 세이브더칠드런: DB 문장에 없어서 '두 곳의 비영리 단체' 문구에 덧붙인다
const companyLink = (url: string, chip: string, label: string) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer" class="whitespace-nowrap">` +
  `<img src="${chip}" alt="" width="15" height="15" class="inline-block w-[15px] h-[15px] rounded-[3px] mr-1 align-[-2px]" />${label}</a>`

const SC_KO = companyLink('https://www.sc.or.kr/', '/chips/savethechildren.png', '세이브더칠드런 코리아')
const SC_EN = companyLink('https://www.sc.or.kr/', '/chips/savethechildren.png', 'Save the Children Korea')

const JOURNEY_RULES: [RegExp, string][] = [
  [/(파수|Fasoo)<sup>\s*1\s*<\/sup>/g, companyLink('https://www.fasoo.ai/', '/chips/fasoo.png', '$1')],
  [/(토스랩|Toss Lab)<sup>\s*2\s*<\/sup>/g, companyLink('https://jandi.com/', '/chips/jandi.png', '$1')],
  [/두 곳의 비영리 단체/g, `${SC_KO}를 포함한 두 곳의 비영리 단체`],
  [/two NGOs/g, `two NGOs, including ${SC_EN}`],
  // 매칭되지 않은 나머지 각주 번호는 제거
  [/<sup>\s*\d+\s*<\/sup>/g, ''],
]

const linkCompanies = (html: string) =>
  JOURNEY_RULES.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), html)

type AboutProps = {
  language: 'en' | 'ko'
}

// 캐싱을 위한 Map 객체 생성
const cache = new Map<string, AboutContent>()

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/30 backdrop-blur-sm">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-transparent animate-spin" />
        </div>
        <p className="mt-2 text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function About({ language }: AboutProps) {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true) // 로딩 상태 추가

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

  if (loading) {
    return <LoadingSpinner /> // 로딩 중일 때 스피너 표시
  }

  if (!content) {
    return null
  }
  return (
    <div className="main flex flex-col items-center justify-center bg-white p-4 pb-12">
      <div className="max-w-md w-full space-y-4">
        <div className="flex flex-col items-center space-y-2 pb-3">
          <Wordmark className="h-6 w-auto text-brand" />
          <span aria-hidden className="block w-8 h-px bg-gray-200 !my-5" />
          <div className="flex flex-col justify-center text-center">
            <h1 className="flex items-center justify-center gap-2">
              <Image
                src="/dowha.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border border-[#f6f5f4] object-cover"
                priority
              />
              {content.name}
            </h1>
            <h2 className="mt-1">{content.title}</h2>
            <CommandPalette language={language} />
          </div>
        </div>
        <div className="space-y-4 text-left pb-2">
          <p
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.intro }}
          />
          <p
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: linkCompanies(content.journey) }}
          />
        </div>
        <BlogHighlights language={language} />
        <History language={language} />
      </div>
    </div>
  )
}
