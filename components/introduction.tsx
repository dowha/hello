'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import CommandPalette from '@/components/commandpalette' // Adjust the import path as necessary

type AboutProps = {
  language: 'en' | 'ko'
  onLanguageChange: (language: 'en' | 'ko') => void
}

export function About({ language }: AboutProps) {
  const content = {
    en: {
      name: 'DOWHA KIM',
      title: 'Digital Maker | B2B SaaS Specialist',
      intro:
        'I enjoy observing the world, imagining new possibilities, recording ideas, making plans, collecting quality information, and sharing the right information with those who need it. I also like exploring my neighborhood, discovering treasures among the flood of web novels, and becoming a regular at certain places.',
      journey:
        'I am currently working as a B2B SaaS specialist in the Fasoo<sup>1</sup> Cloud Services Team. Previously, I was responsible for marketing, communications, and PR at Toss Lab<sup>2</sup> and two NGOs.',
      footnotes: [
        {
          id: 1,
          url: 'https://fasoo.com',
          text: 'Security-focused enterprise software company',
        },
        {
          id: 2,
          url: 'https://jandi.com',
          text: 'A SaaS startup that provides JANDI, a business collaboration tool',
        },
      ],
      things: 'Things I have made→',
      button: ['Email', 'Blog', 'LinkedIn', 'GitHub'],
    },
    ko: {
      name: '김도화(a.k.a. 파도)',
      title: '디지털 메이커 | B2B SaaS 전문가',
      intro:
        "저는 세상을 관찰하는 것, 새로운 무언가를 상상하는 것, 아이디어를 기록하는 것, 계획을 세우는 것, 양질의 정보를 수집하는 것, 필요한 사람에게 적합한 정보를 전달하는 것을 즐깁니다. 동네를 탐험하는 것, 쏟아지는 웹소설 속에서 보물 같은 작품을 찾는 것, 어떤 곳의 단골이 되는 것도 좋아합니다. 어떤 사람들은 저를 '파도'라고 부르는데요. <strong>끝없이 파도쳐도, 멀리서 보면 잔잔해 보이는 바다 같은 삶을 지향합니다.</strong>",
      journey:
        '현재 B2B SaaS(Software as a Service) 전문가로서 파수<sup>1</sup> 클라우드서비스팀의 기획자로 일하고 있습니다. 이전에는 토스랩<sup>2</sup>과 두 곳의 비영리 단체에서 마케팅, 커뮤니케이션, PR을 담당했습니다.',
      footnotes: [
        {
          id: 1,
          url: 'https://fasoo.com',
          text: '보안에 특화된 엔터프라이즈 소프트웨어 기업',
        },
        {
          id: 2,
          url: 'https://jandi.com',
          text: '업무용 협업툴 잔디(JANDI)를 서비스하는 SaaS 스타트업',
        },
      ],
      things: '내가 만든 것들→',
      button: ['이메일', '블로그', '링크드인', '깃헙'],
    },
  }

return (
    <>
      <div className="flex flex-col items-center justify-center bg-white text-[#050005] p-4">
        <style jsx global>{`
          .external-link-icon {
            display: none;
            margin-left: 4px;
          }
          .hover-external-link:hover .external-link-icon {
            display: inline;
          }
        `}</style>

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
              <h1 className={`text-lg font-semibold ${language === 'ko' ? 'korean-text' : ''}`}>
                {content[language].name}
              </h1>
              <p className={`text-sm md:text-base mt-1 ${language === 'ko' ? 'korean-text' : ''}`}>
                {content[language].title}
              </p>
              <CommandPalette language={language} />
            </div>
          </div>
          <div className="space-y-4 h-64 text-left">
            <p
              className={`text-sm md:text-base leading-relaxed ${
                language === 'ko' ? 'korean-text' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: content[language].intro }}
            />
            <p
              className={`text-sm md:text-base leading-relaxed ${
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
              <span>
                <strong>{content[language].things}</strong>
              </span>
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
          <div className="text-xs text-left space-y-1 pt-3 border-t border-[#f6f5f4] h-20">
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
      </div>
    </>
  )
}
