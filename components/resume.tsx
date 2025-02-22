'use client'

import React, { useRef } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Back from '@/components/ui/back'

type Language = 'en' | 'ko'

type TextContent = {
  en: string
  ko: string
}

type LinkContent = {
  text: TextContent
  href: string
  isExternal?: boolean
}

const texts = {
  back: { en: 'Back', ko: '뒤로' },
  downloadPDF: { en: 'Download PDF', ko: 'PDF 다운로드' },
  name: { en: 'Dowha Kim', ko: '김도화' },
  title: { en: 'Content Marketing Specialist', ko: '콘텐츠 마케팅 전문가' },
  contact: {
    location: { en: 'South Korea', ko: '대한민국' },
  },
  summary: {
    en: 'Experienced, data-driven content marketing specialist with a diverse background in user acquisition, engagement, and retention strategies for written contents. Excel in interpersonal and communication skills, developed through teamwork and collaborations with partners.',
    ko: '사용자 유입, 참여, 유지를 위한 콘텐츠 전략을 수립하고 실행한 경험이 있는 데이터 중심의 콘텐츠 마케팅 전문가입니다. 팀워크와 파트너와의 협업을 통해 발전시킨 대인관계 및 커뮤니케이션 능력이 뛰어납니다.',
  },
  experience: {
    title: { en: 'Experience', ko: '경력' },
    jobs: [
      {
        title: { en: 'Product Manager', ko: '기획자(PM)' },
        company: {
          text: { en: 'Fasoo', ko: '파수' },
          href: 'https://fasoo.com',
          isExternal: true,
        },
        period: { en: 'Dec 2023 - Present', ko: '2023.12 - 현재' },
        responsibilities: [
          {
            en: 'Product planning and management for enterprise solutions',
            ko: '기업용 솔루션 제품 기획 및 관리',
          },
        ],
      },
      {
        title: {
          en: 'Contents Marketer / Growth Marketer / Digital Marketer',
          ko: '콘텐츠 마케터 / 그로스 마케터 / 디지털 마케터',
        },
        company: {
          text: { en: 'Toss Lab, Inc.', ko: '토스랩' },
          href: 'https://jandi.com',
          isExternal: true,
        },
        period: { en: 'Aug 2020 - Nov 2023', ko: '2020.08 - 2023.11' },
        responsibilities: [
          {
            en: 'Wrote and promoted articles on smart work trends, featuring recommendations for trending apps and services, for better SEO and organic reach',
            ko: '스마트 워크 트렌드에 대한 글을 작성하고, 인기 있는 앱과 서비스를 추천하여 SEO와 자연 유입을 개선',
          },
          {
            en: 'Developed written and filmed customer success stories and promoted them across various digital channels',
            ko: '고객 성공 사례를 작성 및 촬영하여 다양한 디지털 채널을 통해 홍보',
          },
          {
            en: 'Designed and executed CRM strategy, involving PDF content creation and customer journey optimization',
            ko: 'PDF 콘텐츠 제작 및 고객 여정 최적화를 포함한 CRM 전략 수립 및 실행',
          },
          {
            en: 'Analyzed user data and the customer journey on the website to enhance content creation',
            ko: '웹사이트의 사용자 데이터와 고객 여정을 분석하여 콘텐츠 제작 개선',
          },
        ],
      },
      {
        title: {
          en: 'Communications and Membership Officer',
          ko: '커뮤니케이션 및 회원관리 담당자',
        },
        company: {
          text: { en: 'ILGA Asia', ko: 'ILGA 아시아' },
          href: 'https://ilgaasia.org',
          isExternal: true,
        },
        period: { en: 'Oct 2018 - Jun 2020', ko: '2018.10 - 2020.06' },
        responsibilities: [
          {
            en: 'Established effective communication with ILGA World and regional offices, facilitating strategy sharing',
            ko: 'ILGA World 및 지역 사무소와의 효과적인 커뮤니케이션 구축, 전략 공유 촉진',
          },
          {
            en: 'Initiated and distributed a monthly newsletter to 1,000 subscribers and member organizations',
            ko: '1,000명의 구독자와 회원 조직을 대상으로 월간 뉴스레터 발행 및 배포',
          },
          {
            en: 'Managed social media channels and developed cohesive communication strategies',
            ko: '소셜 미디어 채널 관리 및 일관된 커뮤니케이션 전략 개발',
          },
        ],
      },
      {
        title: {
          en: 'Assistant Manager, Media Communications Team',
          ko: '미디어커뮤니케이션팀 대리',
        },
        company: {
          text: { en: 'Save the Children Korea', ko: '세이브더칠드런' },
          href: 'https://www.sc.or.kr',
          isExternal: true,
        },
        period: { en: 'Oct 2016 - Oct 2018', ko: '2016.10 - 2018.10' },
        responsibilities: [
          {
            en: 'Created content for website, annual report, and quarterly magazine',
            ko: '웹사이트, 연간보고서, 분기별 매거진용 콘텐츠 제작',
          },
          {
            en: 'Produced and translated written and multimedia content, including press releases and video subtitles',
            ko: '보도자료 및 비디오 자막을 포함한 문서 및 멀티미디어 콘텐츠 제작 및 번역',
          },
        ],
      },
    ],
  },
  education: {
    title: { en: 'Education', ko: '학력' },
    degrees: [
      {
        degree: {
          en: 'LLM in International Human Rights Law and Practice',
          ko: '국제인권법 및 실무 법학석사',
        },
        university: {
          text: { en: 'University of York', ko: '요크 대학교' },
          href: 'https://www.york.ac.uk',
          isExternal: true,
        },
        period: { en: 'Sep 2015 - Jan 2017', ko: '2015.09 - 2017.01' },
        location: { en: 'United Kingdom', ko: '영국' },
      },
      {
        degree: {
          en: 'BA in Political Science and International Studies',
          ko: '정치외교학 학사',
        },
        university: {
          text: { en: 'Yonsei University', ko: '연세대학교' },
          href: 'https://www.yonsei.ac.kr',
          isExternal: true,
        },
        period: { en: 'Mar 2008 - Feb 2015', ko: '2008.03 - 2015.02' },
        location: { en: 'South Korea', ko: '대한민국' },
        additional: {
          en: 'Yonsei Univ. Central Journal Editorial Committee member (*Yonsei*, quarterly)',
          ko: '연세대 중앙교지 연세편집위원회(분기별『연세』 발간) 활동',
        },
      },
      {
        degree: {
          en: 'Exchange Student in Business Management',
          ko: '경영학 교환학생',
        },
        university: {
          text: { en: 'Hochschule Pforzheim', ko: '포르츠하임 대학교' },
          href: 'https://www.hs-pforzheim.de',
          isExternal: true,
        },
        period: { en: 'Mar 2013 - Aug 2013', ko: '2013.03 - 2013.08' },
        location: { en: 'Germany', ko: '독일' },
      },
    ],
  },
  skills: {
    title: { en: 'Skills', ko: '기술' },
    languageSkills: {
      title: { en: 'Language Skills', ko: '언어 능력' },
      list: {
        en: 'Korean (Native, proficient in content writing), English (Advanced, IELTS Prize Winner), Japanese (Intermediate)',
        ko: '한국어 (모국어, 콘텐츠 작성 전문), 영어 (고급, IELTS Prize 수상), 일본어 (중급)',
      },
    },
  },
}
function getText(content: TextContent, lang: Language): string {
  return content[lang]
}

interface CVLinkProps {
  content: TextContent
  lang: Language
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
      {getText(content, lang)}
      {isExternal && (
        <span className="w-0 group-hover:w-4 overflow-hidden print-hide"></span>
      )}
    </a>
  )
}

interface ResumeProps {
  lang: Language
}

export default function Resume({ lang }: ResumeProps) {
  const cvRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="flex flex-col items-start justify-start bg-white p-4 pb-12">
        {/* Print control area */}
        <div className="print-hide w-full max-w-[640px] mx-auto">
          <div className="header-controls flex justify-between items-center mb-4">
            <Back />
            <Button onClick={handlePrint} variant="outline" className="mb-4">
              <Download className="mr-2 h-4 w-4" />
              {getText(texts.downloadPDF, lang)}
            </Button>
          </div>
        </div>

        {/* Printable area */}
        <div ref={cvRef} className="w-full max-w-[640px] mx-auto bg-white">
          <div className="mx-auto max-w-screen-sm space-y-4">
            {/* Header */}
            <header className="text-center mb-4">
              <h2 className="text-lg font-bold">{getText(texts.name, lang)}</h2>
              <h3 className="text-sm">{getText(texts.title, lang)}</h3>
              <section className="text-sm mb-4 text-center">
                <p>
                  <a
                    href="https://letterbird.co/hello-7bc2f9f1"
                    target="_blank"
                  >
                    <span>
                      &#109;&#97;&#105;&#108;&#64;&#100;&#111;&#119;&#104;&#97;&#46;&#107;&#105;&#109;
                    </span>
                  </a>{' '}
                  | {getText(texts.contact.location, lang)}
                </p>
              </section>
            </header>

            {/* Sections */}
            <Section title={getText({ en: 'Summary', ko: '요약' }, lang)}>
              <p className="text-sm">{getText(texts.summary, lang)}</p>
            </Section>

            <Section title={getText(texts.experience.title, lang)}>
              {texts.experience.jobs.map((job, index) => (
                <Job
                  key={index}
                  title={getText(job.title, lang)}
                  company={job.company}
                  lang={lang}
                  period={getText(job.period, lang)}
                  responsibilities={job.responsibilities.map((r) =>
                    getText(r, lang)
                  )}
                />
              ))}
            </Section>

            <Section title={getText(texts.education.title, lang)}>
              {texts.education.degrees.map((edu, index) => (
                <div key={index} className="mb-3">
                  <p className="text-sm">
                    <strong>{getText(edu.degree, lang)}</strong>
                  </p>
                  <p className="text-sm">
                    <CVLink
                      content={edu.university.text}
                      lang={lang}
                      href={edu.university.href}
                      isExternal={edu.university.isExternal}
                    />
                    , {getText(edu.location, lang)}
                  </p>
                  <p className="text-sm">{getText(edu.period, lang)}</p>
                  {edu.additional && (
                    <li className="text-sm">{getText(edu.additional, lang)}</li>
                  )}
                </div>
              ))}
            </Section>

            <Section title={getText(texts.skills.title, lang)}>
              <h3 className="text-sm">
                {getText(texts.skills.languageSkills.title, lang)}
              </h3>
              <p className="text-sm">
                {getText(texts.skills.languageSkills.list, lang)}
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  )
}

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

function Job({
  title,
  company,
  lang,
  period,
  responsibilities,
}: {
  title: string
  company: LinkContent
  lang: Language
  period: string
  responsibilities: string[]
}) {
  return (
    <div className="mb-3">
      <h3 className="text-sm">{title}</h3>
      <p className="text-sm">
        <CVLink
          content={company.text}
          lang={lang}
          href={company.href}
          isExternal={company.isExternal}
        />{' '}
        | {period}
      </p>
      <ul className="list-inside mt-1">
        {responsibilities.map((responsibility, index) => (
          <li key={index} className="text-sm">
            {responsibility}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CVLink }
