'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Drawer from '@/components/ui/drawer'
import Back from '@/components/ui/back'
import { supabase } from '@/supabase' // @/supabase.ts에서 클라이언트 가져오기

// Supabase로부터 불러올 데이터 타입 (DB 컬럼명과 매핑 후 변환)
type ProjectItem = {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  link?: string
  categories: string[]
  priority: number
  updateNotes: { text: string; date: string; log?: string }[]
}

type Language = 'en' | 'ko'

interface ThingsProps {
  language: Language // props로 언어 전달받음
}

// static 텍스트 및 UI 관련 데이터 (프로젝트 목록은 Supabase에서 불러옴)
const thingsContent: Record<
  Language,
  {
    title: string
    subtitle: string
    subtitleDescription: string[]
    categories: Record<string, string>
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
    subtitle: 'What toys did you like the most when you were young?',
    subtitleDescription: [
      "One of my favorite toys as a child was Lego. Is that a bit cliché? Perhaps what made it different for me was that my parents only bought me a freestyle Lego box, and I had to create everything with just that. I think that was when I first experienced the joy of making something I wanted without any manuals or guides (even if it wasn't perfect). The most memorable thing I built with Lego was a Battlecruiser, an aerial unit from the game Starcraft, using parts that resembled a fortress.",
      "With that same joy, I wrote poetry in high school. I enjoyed mixing and matching words and sentences to create appropriate expressions, and I achieved some good results. After that, as an adult, I struggled to find any toys that excited me. However, looking back over the years, I realized that since the sixth grade, I've been 'haphazardly' creating websites throughout my life. The language of the web, which I didn't fully understand, was my lifelong toy. Though I don't have professional knowledge, in this age of AI, I plan to leverage various tools to create and showcase many fun things.",
    ],
    categories: {
      live: '🔴 Live Services',
      experiments: '🌱 Experiments',
      toy: '🦖 Toy Projects',
      learning: '🎓 Practice',
      old: '🪦 Old Projects',
    },
    emptyMessage: {
      noSelection:
        '🔍 Whoops! No projects found here. Pick a category to see if they show up!',
      noProjects:
        '☕ No projects in this or any category yet. Time for a coffee break, then back to making some commits!',
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
      "그런 재미를 가지고 고등학교 때는 시를 썼습니다. 단어와 문장을 가지고 이리 조합하고 저리 조합하며 적절한 표현을 만드는 데 재미를 느꼈고, 나름 좋은 성과도 냈습니다. 그 이후 성인이 되고는 이렇다고 할만한 장난감을 찾지 못했습니다. 그런데 지난 시간을 돌이켜보니 초등학교 6학년 때부터 인생 내내 '야매'로 웹사이트를 만들어왔더라고요. 잘 알지도 못하는 웹 세상의 언어가 제 일생의 장난감이었던 것입니다. 비록 전문적 지식은 없지만 대 AI 시대, 다양한 도구를 활용해 다양한 재밌는 것들을 만들고 선보이려 합니다.",
    ],
    categories: {
      live: '🔴 라이브 서비스',
      experiments: '🌱 실험들',
      toy: '🦖 토이 프로젝트',
      learning: '🎓 학습과 연습',
      old: '🪦 오래된 프로젝트',
    },
    emptyMessage: {
      noSelection:
        '🕵️‍♂️ 어라? 프로젝트들이 보이지 않네요. 카테고리를 선택해서 프로젝트를 찾아보세요!',
      noProjects:
        '👨‍🌾 아직 이 카테고리에는 진행한 프로젝트가 없어요. 커피 한 잔하고 다시 열심히 잔디 심으러 갈게요!',
    },
    drawerLabels: {
      close: '닫기',
      viewProject: '프로젝트 보기',
    },
  },
}

export default function Things({ language }: ThingsProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(
    Object.keys(thingsContent[language].categories)
  )
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [projects, setProjects] = useState<ProjectItem[]>([])

  // Supabase에서 프로젝트 데이터 불러오기
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `id, title, short_description, long_description, link, categories, priority,
           project_update_notes(note_text, note_date, note_log)`
        )
        .eq('language', language) // 테이블에 저장된 언어에 맞게 필터링

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      if (data) {
        setProjects(
          data.map((project) => ({
            id: project.id,
            title: project.title,
            shortDescription: project.short_description,
            longDescription: project.long_description,
            link: project.link,
            categories: project.categories,
            priority: project.priority,
            updateNotes:
              project.project_update_notes?.map((note) => ({
                text: note.note_text,
                date: note.note_date,
                log: note.note_log,
              })) || [],
          }))
        )
      }
    }

    fetchProjects()
  }, [language])

  const content = thingsContent[language]

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    )
  }

  // 필터링 및 정렬 (우선순위, 제목 순)
  const filteredProjects = projects.filter((project) =>
    project.categories.some((cat) => activeFilters.includes(cat))
  )

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority
    }
    return a.title.localeCompare(b.title, language === 'ko' ? 'ko' : 'en')
  })

  const ProjectCard = ({ project }: { project: ProjectItem }) => (
    <Drawer project={project} categories={content.categories} />
  )

  return (
    <div className="flex flex-col items-start justify-start bg-white p-4 pb-12">
      <div className="w-full max-w-[640px] mx-auto space-y-4">
        <Back />
        <div className="main w-full max-w-[640px] mx-auto bg-white">
          <h1 className="text-lg font-semibold mb-4">{content.title}</h1>

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
            {Object.entries(content.categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`flex items-center px-2 py-1 rounded-md text-xs transition-colors duration-200 ${
                  activeFilters.includes(key)
                    ? 'bg-[#f1f8ff] border-[#0366d6] font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeFilters.length > 0 ? (
              sortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sortedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
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
    </div>
  )
}
