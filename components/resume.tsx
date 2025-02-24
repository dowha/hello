'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Back from '@/components/ui/back'
import { supabase } from '@/supabase' // @/supabase.ts에서 클라이언트 가져오기

// Supabase에서 가져올 resume 데이터 타입 (새 컬럼 country 추가)
type ResumeItem = {
  id: string
  language: 'en' | 'ko'
  section: string  // 'info', 'experience', 'education', 'skills'
  title: string
  organization: string | null
  organization_url: string | null
  period: string | null
  details: string[] | null
  order_index: number
  country: string | null
}

interface ResumeProps {
  lang: 'en' | 'ko'
}

export default function Resume({ lang }: ResumeProps) {
  const [resumeData, setResumeData] = useState<ResumeItem[]>([])
  const cvRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchResume() {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .order('order_index', { ascending: true })
      if (error) {
        console.error('Error fetching resume:', error)
      } else if (data) {
        setResumeData(data as ResumeItem[])
      }
    }
    fetchResume()
  }, [])

  // 선택한 언어에 맞게 필터링
  const filteredData = resumeData.filter(item => item.language === lang)

  // 섹션별로 그룹화 (info, experience, education, skills)
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {} as { [key: string]: ResumeItem[] })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col items-start justify-start bg-white p-4 pb-12">
      {/* Print control area */}
      <div className="print-hide w-full max-w-[640px] mx-auto">
        <div className="header-controls flex justify-between items-center mb-4">
          <Back />
          <Button onClick={handlePrint} variant="outline" className="mb-4">
            <Download className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download PDF' : 'PDF 다운로드'}
          </Button>
        </div>
      </div>

      {/* Printable area */}
      <div ref={cvRef} className="w-full max-w-[640px] mx-auto bg-white">
        <div className="mx-auto max-w-screen-sm space-y-4">
          {/* Header */}
          <header className="text-center mb-4">
            <h2 className="text-lg font-bold">
              {lang === 'en' ? 'Dowha Kim' : '김도화'}
            </h2>
            <h3 className="text-sm">
              {groupedData['info'] && groupedData['info'][0]?.title
                ? groupedData['info'][0].title
                : lang === 'en'
                ? 'Content Marketing Specialist'
                : '콘텐츠 마케팅 전문가'}
            </h3>
            <section className="text-sm mb-4 text-center">
              <p>
                <a
                  href="https://letterbird.co/hello-7bc2f9f1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &#109;&#97;&#105;&#108;&#64;&#100;&#111;&#119;&#104;&#97;&#46;&#107;&#105;&#109;
                </a>{' '}
                | {lang === 'en' ? 'South Korea' : '대한민국'}
              </p>
            </section>
          </header>

          {/* Summary 섹션 */}
          {groupedData['info'] && groupedData['info'][0] && (
            <Section title={lang === 'en' ? 'Summary' : '요약'}>
              <p className="text-sm">
                {groupedData['info'][0].details
                  ? groupedData['info'][0].details.join(' ')
                  : ''}
              </p>
            </Section>
          )}

          {/* Experience 섹션 */}
          {groupedData['experience'] && groupedData['experience'].length > 0 && (
            <Section title={lang === 'en' ? 'Experience' : '경력'}>
              {groupedData['experience'].map(item => (
                <Job
                  key={item.id}
                  title={item.title}
                  organization={item.organization}
                  organization_url={item.organization_url}
                  period={item.period}
                  responsibilities={item.details || []}
                  lang={lang}
                />
              ))}
            </Section>
          )}

          {/* Education 섹션 */}
          {groupedData['education'] && groupedData['education'].length > 0 && (
            <Section title={lang === 'en' ? 'Education' : '학력'}>
              {groupedData['education'].map(item => (
                <div key={item.id} className="mb-3">
                  <p className="text-sm">
                    <strong>{item.title}</strong>
                  </p>
                  <p className="text-sm">
                    {item.organization && (
                      <CVLink
                        content={{ en: item.organization, ko: item.organization }}
                        lang={lang}
                        href={item.organization_url || '#'}
                        isExternal={true}
                      />
                    )}
                    {item.country && `, ${item.country}`}
                  </p>
                  <p className="text-sm">{item.period}</p>
                  {item.details && item.details.length > 0 && (
                    <ul className="list-inside mt-1">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="text-sm">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Skills 섹션 */}
          {groupedData['skills'] && groupedData['skills'][0] && (
            <Section title={lang === 'en' ? 'Skills' : '기술'}>
              <h3 className="text-sm">
                {lang === 'en' ? 'Language Skills' : '언어 능력'}
              </h3>
              <p className="text-sm">
                {groupedData['skills'][0].details
                  ? groupedData['skills'][0].details.join(', ')
                  : ''}
              </p>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

// 공통 Section 컴포넌트
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-gray-200 pt-3">
      <h2 className="text-sm mb-2">{title}</h2>
      {children}
    </section>
  )
}

// CVLink 컴포넌트 (다국어 링크 텍스트)
interface CVLinkProps {
  content: { en: string; ko: string }
  lang: 'en' | 'ko'
  href: string
  isExternal?: boolean
}

function CVLink({ content, lang, href, isExternal = false }: CVLinkProps) {
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {content[lang]}
      {isExternal && (
        <span className="w-0 group-hover:w-4 overflow-hidden print-hide"></span>
      )}
    </a>
  )
}

// Experience 섹션의 Job 컴포넌트
interface JobProps {
  title: string
  organization: string | null
  organization_url: string | null
  period: string | null
  responsibilities: string[]
  lang: 'en' | 'ko'
}

function Job({
  title,
  organization,
  organization_url,
  period,
  responsibilities,
  lang,
}: JobProps) {
  return (
    <div className="mb-3">
      <h3 className="text-sm">{title}</h3>
      <p className="text-sm">
        {organization && (
          <CVLink
            content={{ en: organization, ko: organization }}
            lang={lang}
            href={organization_url || '#'}
            isExternal={true}
          />
        )}
        {period && ` | ${period}`}
      </p>
      <ul className="list-inside mt-1">
        {responsibilities.map((resp, index) => (
          <li key={index} className="text-sm">
            {resp}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CVLink }
