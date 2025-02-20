'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import CommandPalette from '@/components/ui/commandpalette'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  onLanguageChange: (language: 'en' | 'ko') => void
}

export function About({ language, onLanguageChange }: AboutProps) {
  const [content, setContent] = useState<AboutContent | null>(null)

  async function fetchAboutContent(lang: 'en' | 'ko') {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('language', lang)
      .single()

    if (error) {
      console.error('Error fetching data:', error.message)
      return
    }

    setContent(data)
  }

  useEffect(() => {
    fetchAboutContent(language)
  }, [language])

  if (!content) return <p className="text-center">Loading...</p>

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 pb-12">
      <div className="max-w-md w-full space-y-4">
        <div className="flex flex-col items-center space-y-2 pb-3">
          <div className="relative w-14 h-14">
            <Image
              src="/dowha.png"
              alt={content.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
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
            onClick={() => window.open('https://blog.dowha.kim', '_blank')}
          >
            <span className="external relative">{content.main_button}</span>
          </Button>
          {content.buttons.map(
            (btn: { label: string; url: string }, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full group text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-gray-100 text-gray-800 font-semibold transition-colors duration-300 bg-white"
                onClick={() => window.open(btn.url, '_blank')}
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
