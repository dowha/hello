'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

type projectItem = {
  title: string
  description: string
  link: string
  categories: string[]
}

type Language = 'en' | 'ko'

const thingsContent: Record<
  Language,
  { title: string; items: projectItem[]; categories: Record<string, string> }
> = {
  en: {
    title: '📦 Things I have made.',
    categories: {
      live: '🔴 Live Services',
      experiments: '🌱 Experiments',
      toy: '🦖 Toy Projects',
      learning: '🎓 Learning and Practicing',
      old: '🪦 Old Projects',
    },
    items: [
      {
        title: 'Service A',
        description:
          'Efficient solution for task management and workflow optimization with advanced features.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
      },
      {
        title: 'Service B',
        description: 'Real-time data analytics platform.',
        link: 'https://serviceb.com',
        categories: ['live'],
      },
      {
        title: 'Experiment X',
        description: 'Testing quantum computing applications for optimization.',
        link: 'https://experimentx.com',
        categories: ['experiments'],
      },
      {
        title: 'Toy Alpha',
        description: 'Fun with generative art algorithms and creative coding.',
        link: 'https://toyalpha.com',
        categories: ['toy'],
      },
      {
        title: 'Learn 101',
        description:
          'Exploring machine learning basics with practical examples.',
        link: 'https://learn101.com',
        categories: ['learning'],
      },
      {
        title: 'Legacy 1.0',
        description: 'Deprecated inventory management system from 2018.',
        link: 'https://legacy1.com',
        categories: ['old'],
      },
    ],
  },
  ko: {
    title: '📦 내가 만든 것들.',
    categories: {
      live: '🔴 라이브 서비스',
      experiments: '🌱 실험',
      toy: '🦖 토이 프로젝트',
      learning: '🎓 학습 및 연습',
      old: '🪦 구 프로젝트',
    },
    items: [
      {
        title: '서비스 A',
        description:
          '고급 기능을 갖춘 효율적인 작업 관리 및 워크플로우 최적화 솔루션.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
      },
      {
        title: '서비스 B',
        description: '실시간 데이터 분석 플랫폼.',
        link: 'https://serviceb.com',
        categories: ['live'],
      },
      {
        title: '실험 X',
        description: '최적화를 위한 양자 컴퓨팅 애플리케이션 테스트.',
        link: 'https://experimentx.com',
        categories: ['experiments'],
      },
      {
        title: '토이 알파',
        description:
          '생성 아트 알고리즘과 창의적 코딩을 활용한 재미있는 프로젝트.',
        link: 'https://toyalpha.com',
        categories: ['toy'],
      },
      {
        title: '학습 101',
        description: '실용적인 예제로 머신 러닝 기초 탐구.',
        link: 'https://learn101.com',
        categories: ['learning'],
      },
      {
        title: '레거시 1.0',
        description: '2018년부터 사용되지 않는 재고 관리 시스템.',
        link: 'https://legacy1.com',
        categories: ['old'],
      },
    ],
  },
}

export default function Things() {
  const searchParams = useSearchParams() // Use useSearchParams to get the query parameters
  const [language, setLanguage] = useState<Language>('en')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const lang = searchParams.get('lang') // Use searchParams to get the 'lang' parameter
    if (lang === 'ko' || lang === 'en') {
      setLanguage(lang as Language)
    } else {
      const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
      setLanguage(browserLang as Language)
    }
  }, [searchParams])

  // Ensure content is fetched based on the current language
  const content = thingsContent[language] || thingsContent['en'] // Fallback to English if undefined

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    )
  }

  // Check if content exists before trying to access items
  const filteredProjects = content?.items?.filter(
    (project) =>
      activeFilters.length === 0 ||
      project.categories.some((cat) => activeFilters.includes(cat))
  ) || [] // Fallback to empty array if undefined

  return (
    <>
      <Head>
        <title>{content.title}</title>
        <meta name="description" content={content.title} />
      </Head>
      <div className="min-h-screen bg-white text-[#24292e] p-4 font-sans">
        <div className="max-w-7xl mx-auto">
          <Link href={`/`} passHref>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold mb-6">{content.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(content.categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`flex items-center px-3 py-2 rounded-md border transition-colors duration-200 ${
                  activeFilters.includes(key)
                    ? 'bg-[#f1f8ff] border-[#0366d6]'
                    : 'border-[#e1e4e8] hover:bg-[#f6f8fa]'
                }`}
              >
                <span
                  className={`w-4 h-4 mr-2 rounded flex items-center justify-center ${
                    activeFilters.includes(key)
                      ? 'bg-[#0366d6] text-white'
                      : 'border border-[#666]'
                  }`}
                >
                  {activeFilters.includes(key) && '✓'}
                </span>
                {value}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="border border-[#e1e4e8] rounded-md p-4 bg-white hover:bg-[#f6f8fa] transition-colors duration-200 relative h-[120px] flex flex-col"
              >
                <div className="flex absolute top-0 left-0 right-0 h-0.5">
                  {project.categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex-grow"
                      style={{
                        backgroundColor:
                          cat === 'live'
                            ? '#ff0000'
                            : cat === 'experiments'
                            ? '#90EE90'
                            : cat === 'toy'
                            ? '#008000'
                            : cat === 'learning'
                            ? '#FFFF00'
                            : cat === 'old'
                            ? '#696969'
                            : 'transparent',
                      }}
                    />
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0366d6]"
                >
                <h3 className="text-base font-medium text-[#0366d6] mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-[#24292e] line-clamp-2 flex-grow">
                  {project.description}
                </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}