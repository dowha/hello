'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Drawer } from 'vaul'

type ProjectItem = {
  uid: string
  title: string
  description: string
  link: string
  categories: string[]
  priority: number
  updateNotes: { text: string; date: string }[]
}

type Language = 'en' | 'ko'

const thingsContent: Record<Language, { 
  title: string
  categories: Record<string, string>
  items: ProjectItem[]
  emptyMessage: {
    noSelection: string
    noProjects: string
  }
  drawerLabels: {
    close: string
    viewProject: string
  }
}> = {
  en: {
    title: '📦 Things I have made',
    categories: {
      live: '🔴 Live Services',
      experiments: '🌱 Experiments',
      toy: '🦖 Toy Projects',
      learning: '🎓 Learning and Practicing',
      old: '🪦 Old Projects',
    },
    items: [
      {
        uid: 'service-a',
        title: 'Service A',
        description: 'Task management and workflow optimization solution. Streamlines business processes efficiently.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
        priority: 3,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          { text: 'Added task prioritization feature', date: '2024.02.15' },
          { text: 'Improved user interface for mobile devices', date: '2024.03.10' },
        ],
      },
      {
        uid: 'service-b',
        title: 'Service B',
        description: 'Real-time data analytics platform. Provides actionable insights for businesses.',
        link: 'https://serviceb.com',
        categories: ['live'],
        priority: 2,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          { text: 'Added real-time data streaming capability', date: '2024.02.15' },
          { text: 'Enhanced data visualization tools', date: '2024.03.10' },
        ],
      },
      {
        uid: 'experiment-x',
        title: 'Experiment X',
        description: 'Quantum computing optimization applications. Explores cutting-edge algorithms for complex problem-solving.',
        link: 'https://experimentx.com',
        categories: ['experiments'],
        priority: 1,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          { text: 'Improved algorithm performance', date: '2024.02.15' },
          { text: 'Added support for new quantum hardware', date: '2024.03.10' },
        ],
      },
      {
        uid: 'toy-alpha',
        title: 'Toy Alpha',
        description: 'Generative art algorithms and creative coding. Pushes the boundaries of computational creativity.',
        link: 'https://toyalpha.com',
        categories: ['toy'],
        priority: 0,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          { text: 'Added new generative art styles', date: '2024.02.15' },
          { text: 'Improved code efficiency', date: '2024.03.10' },
        ],
      },
      {
        uid: 'legacy-1',
        title: 'Legacy 1.0',
        description: 'Deprecated inventory management system from 2018. Served as a foundation for modern logistics solutions.',
        link: 'https://legacy1.com',
        categories: ['old'],
        priority: 0,
        updateNotes: [
          { text: 'Initial release', date: '2018.01.23' },
          { text: 'No further updates planned', date: '2018.01.23' },
        ],
      },
    ],
    emptyMessage: {
      noSelection: "🕵️‍♂️ Oops! Looks like my projects are playing hide and seek. Click a category to coax them out of hiding!",
      noProjects: "🚀 Houston, we have a situation! No projects found in this category. Time to brew some coffee and code like there's no tomorrow!"
    },
    drawerLabels: {
      close: "Close",
      viewProject: "View Project"
    }
  },
  ko: {
    title: '📦 내가 만든 것들',
    categories: {
      live: '🔴 라이브 서비스',
      experiments: '🌱 실험',
      toy: '🦖 토이 프로젝트',
      learning: '🎓 학습 및 연습',
      old: '🪦 구 프로젝트',
    },
    items: [
      {
        uid: 'service-a',
        title: '서비스 A',
        description: '작업 관리 및 워크플로우 최적화 솔루션. 비즈니스 프로세스를 효율적으로 간소화합니다.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
        priority: 3,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          { text: '작업 우선 순위 지정 기능 추가', date: '2024.02.15' },
          { text: '모바일 장치 사용자 인터페이스 개선', date: '2024.03.10' },
        ],
      },
      {
        uid: 'service-b',
        title: '서비스 B',
        description: '실시간 데이터 분석 플랫폼. 기업에 실행 가능한 인사이트를 제공합니다.',
        link: 'https://serviceb.com',
        categories: ['live'],
        priority: 2,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          { text: '실시간 데이터 스트리밍 기능 추가', date: '2024.02.15' },
          { text: '데이터 시각화 도구 개선', date: '2024.03.10' },
        ],
      },
      {
        uid: 'experiment-x',
        title: '실험 X',
        description: '양자 컴퓨팅 최적화 애플리케이션. 복잡한 문제 해결을 위한 최첨단 알고리즘을 탐구합니다.',
        link: 'https://experimentx.com',
        categories: ['experiments'],
        priority: 1,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          { text: '알고리즘 성능 개선', date: '2024.02.15' },
          { text: '새로운 양자 하드웨어 지원 추가', date: '2024.03.10' },
        ],
      },
      {
        uid: 'toy-alpha',
        title: '토이 알파',
        description: '생성 아트 알고리즘과 창의적 코딩. 컴퓨테이셔널 창의성의 경계를 넓힙니다.',
        link: 'https://toyalpha.com',
        categories: ['toy'],
        priority: 0,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          { text: '새로운 생성 아트 스타일 추가', date: '2024.02.15' },
          { text: '코드 효율성 개선', date: '2024.03.10' },
        ],
      },
      {
        uid: 'legacy-1',
        title: '레거시 1.0',
        description: '2018년부터 사용되지 않는 재고 관리 시스템. 현대적인 물류 솔루션의 기초 역할을 했습니다.',
        link: 'https://legacy1.com',
        categories: ['old'],
        priority: 0,
        updateNotes: [
          { text: '초기 출시', date: '2018.01.23' },
          { text: '더 이상 업데이트 계획 없음', date: '2018.01.23' },
        ],
      },
    ],
    emptyMessage: {
      noSelection: "🕵️‍♂️ 어라? 프로젝트들이 숨바꼭질을 하는 것 같아요. 카테고리를 클릭해서 그들을 찾아주세요!",
      noProjects: "🚀 휴스턴, 문제가 생겼어요! 이 카테고리에 프로젝트가 없습니다. 커피 한 잔 마시고 코딩 모드 돌입해야겠어요!"
    },
    drawerLabels: {
      close: "닫기",
      viewProject: "프로젝트 보기"
    }
  },
}

export default function Things() {
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<Language>('en')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const lang = searchParams.get('lang')
    if (lang === 'ko' || lang === 'en') {
      setLanguage(lang)
    } else {
      const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en'
      setLanguage(browserLang)
    }
  }, [searchParams])

  useEffect(() => {
    setActiveFilters(Object.keys(thingsContent[language].categories))
  }, [language])

  const content = thingsContent[language]

  const toggleFilter = (category: string) => {
    setActiveFilters(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    )
  }

  const filteredProjects = content.items.filter(project =>
    project.categories.some(cat => activeFilters.includes(cat))
  )

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    return a.title.localeCompare(b.title, language === 'ko' ? 'ko' : 'en')
  })

  const currentProjects = sortedProjects.filter(project => !project.categories.includes('old'))
  const oldProjects = sortedProjects.filter(project => project.categories.includes('old'))

  const ProjectCard = ({ project }: { project: ProjectItem }) => (
    <Drawer.Root>
      <Drawer.Trigger className="border border-[#e1e4e8] rounded-md p-2 bg-white hover:bg-[#f6f8fa] transition-colors duration-200 relative cursor-pointer w-full text-left">
        <div className="flex absolute top-0 left-0 right-0 h-0.5">
          {project.categories.map((cat) => (
            <div
              key={cat}
              className="flex-grow"
              style={{
                backgroundColor:
                  cat === 'live' ? '#ff0000' :
                  cat === 'experiments' ? '#90EE90' :
                  cat === 'toy' ? '#008000' :
                  cat === 'learning' ? '#FFFF00' :
                  cat === 'old' ? '#696969' : 'transparent'
              }}
            />
          ))}
        </div>
        <div className={`text-sm transition-colors duration-300 ${
          project.categories.includes('old') 
            ? 'text-gray-500 hover:text-gray-700' 
            : 'hover:text-[#0a85d1]'
        }`}>
          <h3 className="text-sm font-medium mb-1">
            {project.title}
          </h3>
          <p className="text-xs line-clamp-2">
            {project.description}
          </p>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[60vh] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-start mb-2">
                <Drawer.Title className="font-medium text-[15px]">
                  {project.title}
                </Drawer.Title>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((category) => (
                  <span key={category} className="text-xs bg-gray-100 text-gray-800 rounded-md px-2 py-1">
                    {content.categories[category]}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {project.description}
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Update Notes:</h4>
                <div className="bg-gray-100 p-3 rounded-md max-h-48 overflow-y-auto">
                  <ul className="list-none text-sm text-gray-600 space-y-2">
                    {project.updateNotes.map((note, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{note.text}</span>
                        <span className="text-gray-400">{note.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-white text-[#050005] p-4 font-pretendard">
      <div className="w-full max-w-[640px] mx-auto space-y-4">
        <Link href={`/?lang=${language}`} passHref>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold mb-4">{content.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
  {Object.entries(content.categories).map(([key, value], index, array) => (
    <div key={key} className="flex items-center">  {/* Fragment를 div로 변경하고 key 추가 */}
      <button
        onClick={() => toggleFilter(key)}
        className={`flex items-center px-2 py-1 rounded-md text-xs transition-colors duration-200 ${
          activeFilters.includes(key)
            ? 'bg-[#f1f8ff] border-[#0366d6] font-semibold'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
        }`}
      >
        {value}
      </button>
      {key === 'learning' && index !== array.length - 1 && (
        <span className="text-gray-300 mx-1">|</span>
      )}
    </div>
  ))}
</div>
        
        <div className="space-y-6">
          {activeFilters.length > 0 ? (
            sortedProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentProjects.map((project) => (
                    <ProjectCard key={project.uid} project={project} />
                  ))}
                </div>

                {oldProjects.length > 0 && (
                  <>
                    <hr className="border-t border-gray-200" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {oldProjects.map((project) => (
                        <ProjectCard key={project.uid} project={project} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-left py-8 text-gray-500 text-sm">
                {content.emptyMessage.noProjects}
              </div>
            )
          ) : (
            <div className="text-left py-8 text-gray-500 text-sm">
              {content.emptyMessage.noSelection}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}