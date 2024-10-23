'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

type LanguageSwitcherProps = {
  language: 'en' | 'ko'
  setLanguage: (lang: 'en' | 'ko') => void
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  setLanguage,
}) => {
  return (
    <div className="inline-flex items-center rounded-md bg-[#f6f5f4] p-0.5 text-sm font-medium">
      <button
        onClick={() => setLanguage('ko')}
        className={`rounded-md px-3 py-1.5 transition-all ${
          language === 'ko'
            ? 'bg-white shadow-sm font-bold'
            : 'text-[#050005] hover:text-[#0a85d1]'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-md px-3 py-1.5 transition-all ${
          language === 'en'
            ? 'bg-white shadow-sm font-bold'
            : 'text-[#050005] hover:text-[#0a85d1]'
        }`}
      >
        English
      </button>
    </div>
  )
}

export function About() {
  const [language, setLanguage] = useState<'en' | 'ko'>('ko')

  useEffect(() => {
    const userLanguage = navigator.language || navigator.languages[0]
    if (!userLanguage.startsWith('ko')) {
      setLanguage('en')
    }
  }, [])

  const content = {
    en: {
      name: 'DOWHA KIM',
      title: 'B2B SaaS Specialist in Planning and Marketing',
      keywords: ['B2B', 'SaaS', 'multipotentialite', 'tech-savvy'],
      intro:
        "Hello! I'm a passionate B2B SaaS specialist with 5 years of experience in creating innovative solutions. I specialize in product planning, marketing strategies, and user experience design for SaaS platforms.",
      journey:
        "After working at two NGOs and Toss Lab<sup>1</sup>, I'm currently working in the Cloud Service Team at Fasoo<sup>2</sup>.",
      footnotes: [
        { id: 1, url: 'https://jandi.com', text: 'A SaaS startup that provides JANDI, a business collaboration tool' },
        { id: 2, url: 'https://fasoo.com', text: 'Security-focused enterprise software company' },
      ],
      things: 'Things I have made→',
      button: ['Email', 'Blog', 'LinkedIn', 'GitHub'],
    },
    ko: {
      name: '김도화',
      title: 'B2B SaaS 전문 기획자 및 마케터',
      keywords: ['B2B', 'SaaS', '다재다능', '기술 친화적'],
      intro:
        '안녕하세요! 저는 혁신적인 솔루션을 만드는 데 5년의 경험을 가진 열정적인 B2B SaaS 전문가입니다. SaaS 플랫폼을 위한 제품 기획, 마케팅 전략 및 사용자 경험 디자인을 전문으로 합니다.',
      journey:
        '두 NGO와 토스랩<sup>1</sup>을 거쳐 현재 파수<sup>2</sup> 클라우드서비스팀에서 일하고 있습니다.',
      footnotes: [
        { id: 1, url: 'https://jandi.com', text: '업무용 협업툴 잔디(JANDI)를 서비스하는 SaaS 스타트업' },
        { id: 2, url: 'https://fasoo.com', text: '보안에 특화된 엔터프라이즈 소프트웨어 기업' },
      ],
      things: '내가 만든 것들→',
      button: ['이메일', '블로그', '링크드인', '깃헙'],
    },
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#050005] p-4 font-pretendard">
        <style jsx global>{`
          @font-face {
            font-family: 'Pretendard';
            src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff')
              format('woff');
            font-weight: 400;
            font-style: normal;
          }

          @font-face {
            font-family: 'Pretendard';
            src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff')
              format('woff');
            font-weight: 600;
            font-style: normal;
          }

          body {
            font-family: 'Pretendard', sans-serif;
          }

          ::selection {
            background-color: #e6f3ff;
          }
          .external-link-icon {
            display: none;
            margin-left: 4px;
          }
          .hover-external-link:hover .external-link-icon {
            display: inline;
          }
        `}</style>
        <div className="fixed top-4 right-4">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
        <div className="max-w-md w-full space-y-4">
          <div className="flex flex-col items-center space-y-2 pb-3">
            <div className="relative w-14 h-14">
              <Image
                src="/dowha.png"
                alt={content[language].name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-lg">
                🌊
              </div>
            </div>
            <div className="flex flex-col justify-center text-center">
              <h1
                className={`text-[17px] ${
                  language === 'ko' ? 'korean-text' : ''
                }`}
                style={{ fontWeight: 600 }}
              >
                {content[language].name}
              </h1>
              <p
                className={`text-[16px] mt-1 ${
                  language === 'ko' ? 'korean-text' : ''
                }`}
                style={{ fontWeight: 400 }}
              >
                {content[language].title}
              </p>
              <div className="flex flex-wrap justify-center mt-2 gap-2">
                {content[language].keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs transition-colors duration-300 hover:bg-blue-50"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 h-64 overflow-y-auto text-left">
            <p
              className={`text-[16px] leading-relaxed ${
                language === 'ko' ? 'korean-text' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: content[language].intro }}
            />
            <p
              className={`text-[16px] leading-relaxed ${
                language === 'ko' ? 'korean-text' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: content[language].journey }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f6f5f4]">
            <Button
              className="w-full col-span-2 text-xs md:text-sm flex items-center justify-center space-x-2 bg-[#121212] text-white hover:bg-[#333333] transition-colors duration-300"
              onClick={() => window.open(`/things?lang=${language}`, '_self')}
            >
              <span>{content[language].things}</span>
            </Button>
            <Button
              className="w-full text-xs md:text-sm flex items-center justify-center space-x-2 bg-white text-[#050005] border border-[#e0e0e0] hover:bg-[#f0f0f0] transition-colors duration-300"
              onClick={() => window.open('mailto:hello@dowha.kim')}
            >
              <span>{content[language].button[0]}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-[#f0f0f0] transition-colors duration-300 bg-white hover-external-link"
              onClick={() => window.open('https://blog.dowha.kim', '_blank')}
            >
              <span>{content[language].button[1]}</span>
              <ExternalLink className="w-2 h-2 md:w-3 md:h-3 external-link-icon" />
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-[#f0f0f0] transition-colors duration-300 bg-white hover-external-link"
              onClick={() =>
                window.open('https://www.linkedin.com/in/dowha', '_blank')
              }
            >
              <span>{content[language].button[2]}</span>
              <ExternalLink className="w-2 h-2 md:w-3 md:h-3 external-link-icon" />
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-[#f0f0f0] transition-colors duration-300 bg-white hover-external-link"
              onClick={() => window.open('https://github.com/dowha', '_blank')}
            >
              <span>{content[language].button[3]}</span>
              <ExternalLink className="w-2 h-2 md:w-3 md:h-3 external-link-icon" />
            </Button>
          </div>
          <div className="text-[10px] md:text-xs text-left space-y-1 pt-3 border-t border-[#f6f5f4] h-20">
            {content[language].footnotes.map((footnote) => (
              <p key={footnote.id} className="flex items-center">
                <sup className="text-xss font-normal mr-1">{footnote.id}</sup>
                <a
                  href={footnote.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0a85d1] transition-colors duration-300 hover-external-link"
                >
                  {footnote.text}
                  <ExternalLink className="w-3 h-3 inline-block ml-1 external-link-icon" />
                </a>
              </p>
            ))}
          </div>
        </div>
        <footer className="w-full border-t border-gray-200 fixed bottom-0 left-0 right-0 h-126 flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto text-center text-xs text-gray-500 py-2">
          ⬢ Proudly generalist, embracing an open-source mindset.
          </div>
        </footer>
      </div>
    </>
  )
}
