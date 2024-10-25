'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Drawer } from 'vaul'

type ProjectItem = {
  uid: string
  title: string
  shortDescription: string
  longDescription: string
  link?: string
  categories: string[]
  priority: number
  updateNotes: { text: string; date: string; log?: string }[]
}

type Language = 'en' | 'ko'

const thingsContent: Record<
  Language,
  {
    title: string
    subtitle: string
    subtitleDescription: string[]
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
  }
> = {
  en: {
    title: '📦 Things I have made',
    subtitle: 'What kind of toys did you like the most when you were young?',
    subtitleDescription: [
      "One of my favorite toys as a child was Lego. Is that a bit cliché? Perhaps what made it different for me was that my parents only bought me a freestyle Lego box, and I had to create everything with just that. I think that was when I first experienced the joy of making something I wanted without any manuals or guides (even if it wasn't perfect). The most memorable thing I built with Lego was a Battlecruiser, an aerial unit from the game Starcraft, using parts that resembled a fortress.",
      "With that same joy, I wrote poetry in high school. I enjoyed mixing and matching words and sentences to create appropriate expressions, and I achieved some good results. After that, as an adult, I struggled to find any toys that excited me. However, looking back over the years, I realized that since the sixth grade, I've been 'haphazardly' creating websites throughout my life. The language of the web, which I didn't fully understand, was my lifelong toy. Though I don't have professional knowledge, in this age of AI, I plan to leverage various tools to create and showcase many fun things."
  ],
    categories: {
      live: '🔴 Live Services',
      experiments: '🌱 Experiments',
      toy: '🦖 Toy Projects',
      learning: '🎓 Practice',
      old: '🪦 Old Projects',
    },
    items: [
      {
        uid: 'service-a',
        title: 'Service A',
        shortDescription: 'Task management and workflow optimization solution.',
        longDescription:
          'Service A is a comprehensive task management and workflow optimization solution designed to streamline business processes efficiently. It offers intuitive interfaces for task assignment, progress tracking, and performance analytics, enabling teams to collaborate seamlessly and boost productivity.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
        priority: 3,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          {
            text: 'Added task prioritization feature',
            date: '2024.02.15',
            log: 'Implemented a new algorithm for task prioritization',
          },
          {
            text: 'Improved user interface for mobile devices',
            date: '2024.03.10',
          },
        ],
      },
      {
        uid: 'service-b',
        title: 'Service B',
        shortDescription: 'Real-time data analytics platform.',
        longDescription:
          'Service B is a cutting-edge real-time data analytics platform that provides actionable insights for businesses. Leveraging advanced algorithms and machine learning, it processes vast amounts of data in real-time, offering valuable insights that drive informed decision-making and strategic planning.',
        link: 'https://serviceb.com',
        categories: ['live'],
        priority: 2,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          {
            text: 'Added real-time data streaming capability',
            date: '2024.02.15',
            log: 'Integrated Apache Kafka for real-time data processing',
          },
          { text: 'Enhanced data visualization tools', date: '2024.03.10' },
        ],
      },
      {
        uid: 'experiment-x',
        title: 'Experiment X',
        shortDescription: 'Quantum computing optimization applications.',
        longDescription:
          "Experiment X is a groundbreaking project exploring quantum computing optimization applications. It delves into cutting-edge algorithms for complex problem-solving, pushing the boundaries of what's possible with quantum technologies. This experiment aims to revolutionize fields such as cryptography, drug discovery, and financial modeling.",
        categories: ['experiments'],
        priority: 1,
        updateNotes: [
          { text: 'Initial release', date: '2024.01.23' },
          { text: 'Improved algorithm performance', date: '2024.02.15' },
          {
            text: 'Added support for new quantum hardware',
            date: '2024.03.10',
            log: 'Integrated with IBM Q System One',
          },
        ],
      },
      {
        uid: 'toy-alpha',
        title: 'Toy Alpha',
        shortDescription: 'Generative art algorithms and creative coding.',
        longDescription:
          'Toy Alpha is an exciting project that explores generative art algorithms and creative coding. It pushes the boundaries of computational creativity, generating unique and mesmerizing visual artworks. This project serves as a playground for experimenting with various algorithmic approaches to art creation.',
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
        shortDescription: 'Deprecated inventory management system from 2018.',
        longDescription:
          'Legacy 1.0 is a deprecated inventory management system that was developed in 2018. Although no longer in active use, it served as a crucial foundation for modern logistics solutions. This system pioneered several features that have since become standard in inventory management software.',
        categories: ['old'],
        priority: 0,
        updateNotes: [
          { text: 'Initial release', date: '2018.01.23' },
          { text: 'No further updates planned', date: '2018.01.23' },
        ],
      },
    ],
    emptyMessage: {
      noSelection:
        '🔍 Whoops! No projects found here. Click a category to see if they show up!',
      noProjects:
        '☕ No projects in this category yet. Time for a coffee break, then back to making some commits!',
    },
    drawerLabels: {
      close: 'Close',
      viewProject: 'View Project',
    },
  },
  ko: {
    title: '📦 내가 만든 것들',
    subtitle: '어릴 때 어떤 장난감을 가장 좋아했나요?',
    subtitleDescription: [
      '어린 시절 제가 가장 좋아했던 장난감 중 하나는 바로 레고였습니다. 좀 뻔한가요? 어쩌면 남들과 조금 달랐던 지점은 저희 부모님께서 저한테 프리스타일 레고 박스 하나만을 사주셨고, 전 그것만을 가지고 모든 걸 만들어야 했다는 것입니다. 어떤 매뉴얼이나 정보도 없이 (완벽하지 않더라도) 내가 만들고 싶은 무언가를 만드는 재미를 그때 처음 느낀 것 같습니다. 레고로 만들었던 것 중 가장 기억에 남는 건 성벽과 같은 파트를 활용해 만든 배틀크루저(게임 스타크래프트에 나오는 공중 유닛)입니다.',
      '그런 재미를 가지고 고등학교 때는 시를 썼습니다. 단어와 문장을 가지고 이리 조합하고 저리 조합하며 적절한 표현을 만드는 데 재미를 느꼈고, 나름 좋은 성과도 냈습니다. 그 이후 성인이 되고는 이렇다고 할만한 장난감을 찾지 못했습니다. 그런데 지난 시간을 돌이켜보니 초등학교 6학년 때부터 인생 내내 \'야매\'로 웹사이트를 만들어왔더라고요. 잘 알지도 못하는 웹 세상의 언어가 제 일생의 장난감이었던 것입니다. 비록 전문적 지식은 없지만 대 AI 시대, 다양한 도구를 활용해 다양한 재밌는 것들을 만들고 선보이려 합니다.',
    ],
    categories: {
      live: '🔴 라이브 서비스',
      experiments: '🌱 실험들',
      toy: '🦖 토이 프로젝트',
      learning: '🎓 학습과 연습',
      old: '🪦 오래된 프로젝트',
    },
    items: [
      {
        uid: 'service-a',
        title: '서비스 A',
        shortDescription: '작업 관리 및 워크플로우 최적화 솔루션.',
        longDescription:
          '서비스 A는 비즈니스 프로세스를 효율적으로 간소화하도록 설계된 종합적인 작업 관리 및 워크플로우 최적화 솔루션입니다. 작업 할당, 진행 상황 추적 및 성과 분석을 위한 직관적인 인터페이스를 제공하여 팀이 원활하게 협업하고 생산성을 높일 수 있도록 합니다.',
        link: 'https://servicea.com',
        categories: ['live', 'experiments'],
        priority: 3,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          {
            text: '작업 우선 순위 지정 기능 추가',
            date: '2024.02.15',
            log: '작업 우선순위 지정을 위한 새로운 알고리즘 구현',
          },
          { text: '모바일 장치 사용자 인터페이스 개선', date: '2024.03.10' },
        ],
      },
      {
        uid: 'service-b',
        title: '서비스 B',
        shortDescription: '실시간 데이터 분석 플랫폼.',
        longDescription:
          '서비스 B는 기업에 실행 가능한 인사이트를 제공하는 최첨단 실시간 데이터 분석 플랫폼입니다. 고급 알고리즘과 기계 학습을 활용하여 방대한 양의 데이터를 실시간으로 처리하여 정보에 입각한 의사 결정과 전략적 계획을 추진하는 귀중한 인사이트를 제공합니다.',
        link: 'https://serviceb.com',
        categories: ['live'],
        priority: 2,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          {
            text: '실시간 데이터 스트리밍 기능 추가',
            date: '2024.02.15',
            log: '실시간 데이터 처리를 위한 Apache Kafka 통합',
          },
          { text: '데이터 시각화 도구 개선', date: '2024.03.10' },
        ],
      },
      {
        uid: 'experiment-x',
        title: '실험 X',
        shortDescription: '양자 컴퓨팅 최적화 애플리케이션.',
        longDescription:
          '실험 X는 양자 컴퓨팅 최적화 애플리케이션을 탐구하는 혁신적인 프로젝트입니다. 복잡한 문제 해결을 위한 최첨단 알고리즘을 탐구하여 양자 기술로 가능한 것의 경계를 넓힙니다. 이 실험은 암호학, 신약 발견 및 금융 모델링과 같은 분야에 혁명을 일으키는 것을 목표로 합니다.',
        categories: ['experiments'],
        priority: 1,
        updateNotes: [
          { text: '초기 출시', date: '2024.01.23' },
          { text: '알고리즘 성능 개선', date: '2024.02.15' },
          {
            text: '새로운 양자 하드웨어 지원 추가',
            date: '2024.03.10',
            log: 'IBM Q System One과 통합',
          },
        ],
      },
      {
        uid: 'toy-alpha',
        title: '토이 알파',
        shortDescription: '생성 아트 알고리즘과 창의적 코딩.',
        longDescription:
          '토이 알파는 생성 아트 알고리즘과 창의적 코딩을 탐구하는 흥미진진한 프로젝트입니다. 컴퓨테이셔널 창의성의 경계를 넓혀 독특하고 매혹적인 시각 예술 작품을 생성합니다. 이 프로젝트는 예술 창작을 위한 다양한 알고리즘적 접근 방식을 실험하는 놀이터 역할을 합니다.',
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
        shortDescription: '2018년부터 사용되지 않는 재고 관리 시스템.',
        longDescription:
          '레거시 1.0은 2018년에 개발된 더 이상 사용되지 않는 재고 관리 시스템입니다. 더 이상 활발히 사용되지는 않지만 현대적인 물류 솔루션의 중요한 기초 역할을 했습니다. 이 시스템은 이후 재고 관리 소프트웨어의 표준이 된 여러 기능을 선보였습니다.',
        categories: ['old'],
        priority: 0,
        updateNotes: [
          { text: '초기 출시', date: '2018.01.23' },
          { text: '더 이상 업데이트 계획 없음', date: '2018.01.23' },
        ],
      },
    ],
    emptyMessage: {
      noSelection:
        '🕵️‍♂️ 어라? 프로젝트들이 보이지 않네요. 카테고리를 클릭해서 프로젝트를 찾아보세요!',
      noProjects:
        '👨‍🌾 아직 이 카테고리에는 진행한 프로젝트가 없어요. 커피 한 잔하고 다시 열심히 잔디 심으러 갈게요!',
    },
    drawerLabels: {
      close: '닫기',
      viewProject: '프로젝트 보기',
    }
  },
}

export default function Things() {
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<Language>('ko')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFullDescription, setShowFullDescription] = useState(false)

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
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    )
  }

  const filteredProjects = content.items.filter((project) =>
    project.categories.some((cat) => activeFilters.includes(cat))
  )

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    return a.title.localeCompare(b.title, language === 'ko' ? 'ko' : 'en')
  })

  const currentProjects = sortedProjects.filter(
    (project) => !project.categories.includes('old')
  )
  const oldProjects = sortedProjects.filter((project) =>
    project.categories.includes('old')
  )

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
        <div
          className={`text-sm transition-colors duration-300 ${
            project.categories.includes('old')
              ? 'text-gray-500 hover:text-gray-700'
              : 'hover:text-[#0a85d1]'
          }`}
        >
          <h3 className="text-sm font-medium mb-1">{project.title}</h3>
          <p className="text-xs line-clamp-2">{project.shortDescription}</p>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[40vh] mt-[60vh] fixed bottom-0 left-0 right-0 overflow-hidden">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto pb-6">
              <div className="flex justify-between items-start mb-2">
                <Drawer.Title className="font-medium text-[15px] flex items-center">
                <strong>{project.title}</strong>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </Drawer.Title>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="text-xs bg-gray-100 text-gray-800 rounded-md px-2 py-1"
                  >
                    {content.categories[category]}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {project.longDescription}
              </p>
              <div className="mt-4 text-sm">
                <h4 className="font-medium mb-2">
                  Voyage Log
                </h4>
                <div className="bg-gray-100 p-3 rounded-md max-h-48 overflow-y-auto mb-6">
                  <ul className="list-none text-gray-600 space-y-2 divide-y divide-gray-200 divide-opacity-50">
                    {project.updateNotes.map((note, index) => (
                      <li key={index} className="flex flex-col pt-2 first:pt-0">
                        <div className="flex justify-between">
                          <span>{note.text}</span>
                          <span className="text-gray-400">{note.date}</span>
                        </div>
                        {note.log && (
                          <span className="text-xs text-gray-500 mt-1">
                            {note.log}
                          </span>
                        )}
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
    <div className="flex flex-col items-start justify-start bg-white text-[#050005] p-4">
      <div className="w-full max-w-[640px] mx-auto space-y-4">
        <Link href={`/`} passHref>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold mb-4">{content.title}</h1>

        <div className="mb-4">
     <div 
  className="flex items-center justify-between mb-2 cursor-pointer group"
  onClick={() => setShowFullDescription(!showFullDescription)}
>
  <div className="flex items-center">
    <div className="relative w-4 h-4 mr-1">
      {showFullDescription ? (
        <>
          <Eye className="w-4 h-4 group-hover:hidden" />
          <EyeOff className="w-4 h-4 hidden group-hover:block absolute inset-0" />
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4 group-hover:hidden" />
          <Eye className="w-4 h-4 hidden group-hover:block absolute inset-0" />
        </>
      )}
    </div>
    <p className="text-sm">{content.subtitle}</p>
  </div>
</div>
          {showFullDescription && (
            <div className="mt-2 text-sm text-gray-600">
              {content.subtitleDescription.map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        <hr className="border-t border-gray-200 my-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(content.categories).map(
            ([key, value], index, array) => (
              <div key={key} className="flex items-center">
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
            )
          )}
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
