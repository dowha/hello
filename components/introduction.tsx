'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import CommandPalette from '@/components/ui/commandpalette'
import { supabase } from '@/supabase' // supabase.ts에서 클라이언트 가져오기

// 데이터 타입 정의
type AboutContent = {
  name: string
  title: string
  intro: string
  journey: string
  footnotes: { id: number; url: string; text: string }[]
  buttons: { label: string; url: string }[]
  main_button: string
}

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
      .select('name, title, intro, journey, footnotes, buttons, main_button')
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
          <div className="relative w-14 h-14">
            <Image
              src="/dowha.png"
              alt={content.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full border border-[#f6f5f4]"
              priority
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-lg">
              🌊
            </div>
          </div>
          <div className="flex flex-col justify-center text-center">
            <h1>{content.name}</h1>
            <h2 className="mt-1">{content.title}</h2>
            <CommandPalette language={language} />
          </div>
        </div>
        <div className="space-y-4 h-64 text-left">
          <p
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.intro }}
          />
          <p
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.journey }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f6f5f4]">
          <Button
            variant="outline"
            className="w-full group col-span-2 text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-gray-100 text-gray-800 font-semibold bg-white transition-colors duration-300"
            onMouseUp={(event) => {
              if (event.button === 1 || event.ctrlKey) {
                window.open('https://blog.dowha.kim', '_blank', 'noopener')
              } else {
                window.location.href = 'https://blog.dowha.kim'
              }
            }}
          >
            <span className="external relative">{content.main_button}</span>
          </Button>
          {content.buttons.map(
            (btn: { label: string; url: string }, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full group text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-gray-100 text-gray-800 font-semibold transition-colors duration-300 bg-white"
                onMouseUp={(event) => {
                  if (event.button === 1 || event.ctrlKey) {
                    window.open('https://blog.dowha.kim', '_blank', 'noopener')
                  } else {
                    window.location.href = 'https://blog.dowha.kim'
                  }
                }}
              >
                <span className="external relative">{btn.label}</span>
              </Button>
            )
          )}
        </div>
        <div className="text-xs text-left space-y-1 pt-3 border-t border-[#f6f5f4] h-20 mb-2">
          {content.footnotes.map(
            ({ id, url, text }: { id: number; url: string; text: string }) => (
              <p key={id} className="flex items-center">
                <sup className="text-xss font-normal mr-1">{id}</sup>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
