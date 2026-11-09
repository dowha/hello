import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from './dialog'

type Language = 'en' | 'ko'
type CommandPaletteProps = {
  language?: Language
}

const CommandPalette = ({ language = 'en' }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const items = () => Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-palette-item]') ?? [])

  // ↑↓·Home·End로 항목 사이 포커스 이동 (Enter는 포커스된 버튼이 처리)
  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || e.nativeEvent.isComposing) return
    const list = items()
    if (!list.length) return
    e.preventDefault()
    const cur = list.indexOf(document.activeElement as HTMLButtonElement)
    const last = list.length - 1
    const next =
      e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : e.key === 'ArrowDown' ? (cur < 0 || cur === last ? 0 : cur + 1)
      : cur <= 0 ? last : cur - 1
    list[next].focus()
  }

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setPlatform(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent))
    }
  }, [])

  // ⌘K(맥) / Ctrl+K(그 외)로 팔레트 열고 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.isComposing) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  const content = {
    en: {
      buttonText: 'Get to know me more...',
      navigation: 'Navigation',
      // 그룹 사이에 구분선이 들어간다
      navGroups: [
        [
          { title: 'Resume', href: `/resume` },
          { title: 'Contact', href: 'https://letterbird.co/hello-dowha' },
        ],
        [
          { title: 'Blog', href: 'https://blog.dowha.kim' },
          { title: 'LinkedIn', href: 'https://www.linkedin.com/in/kimdowha/' },
          { title: 'X(formerly Twitter)', href: 'https://x.com/dowha_kim' },
        ],
        [
          { title: 'Lazydesk Studio', href: 'https://lazydesk.studio/' },
          // indent: 상위 항목(레이지데스크 스튜디오)의 하위로 들여쓰기
          { title: 'K League Calendar', href: 'https://kleague.lazydesk.studio/', indent: true },
        ],
      ],
    },
    ko: {
      buttonText: '저에 대해 더 궁금하시다면...',
      navigation: '더 알아보기',
      navGroups: [
        [
          { title: '이력서', href: `/resume` },
          { title: '연락하기', href: 'https://letterbird.co/hello-dowha' },
        ],
        [
          { title: '블로그', href: 'https://blog.dowha.kim' },
          { title: '링크드인', href: 'https://www.linkedin.com/in/kimdowha/' },
          { title: 'X(구 트위터)', href: 'https://x.com/dowha_kim' },
        ],
        [
          { title: '레이지데스크 스튜디오', href: 'https://lazydesk.studio/' },
          { title: 'K리그 일정 캘린더', href: 'https://kleague.lazydesk.studio/', indent: true },
        ],
      ],
    },
  }

  const currentContent = content[language]

  const shortcutLabel = isMobile
    ? language === 'en'
      ? 'Tap!'
      : '탭!'
    : `${platform} K`

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-[260px] flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-500 text-xs hover:border-brand focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Search className="w-3 h-3" />
        <span>{currentContent.buttonText}</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500">
          {shortcutLabel}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="p-0 custom-dialog-content border w-[90%] max-w-[600px] mx-auto rounded-lg overflow-hidden bg-white"
          onClick={handleClose} // ✅ 바깥 클릭 감지
          onKeyDown={onListKeyDown}
          // 열리면 ESC 버튼 대신 첫 항목에 포커스
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            items()[0]?.focus()
          }}
        >
          <div className="w-full bg-white" onClick={(e) => e.stopPropagation()}>
            {/* ✅ 내부 요소 클릭은 닫히지 않도록 이벤트 버블링 차단 */}
            <div className="border-b px-3 py-2 flex justify-between items-center">
              {/* 스크린리더용 다이얼로그 제목 (Radix 접근성 요구사항) */}
              <DialogTitle className="text-sm font-semibold leading-normal tracking-normal">
                {currentContent.navigation}
              </DialogTitle>
              <button
                className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500 cursor-pointer"
                onClick={() => setOpen(false)} // ✅ 닫기 버튼 정상 작동
              >
                {isMobile ? '닫기' : 'ESC'}
              </button>
            </div>

            <div ref={listRef} className="max-h-[300px] overflow-y-auto">
              {currentContent.navGroups.map((group, i) => (
                <div
                  key={i}
                  className={`py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  {group.map((item) => (
                    <button
                      key={item.href}
                      data-palette-item
                      // 마우스를 올린 항목에도 포커스를 옮겨 키보드와 강조가 어긋나지 않게 한다
                      onMouseMove={(e) => e.currentTarget.focus()}
                      onClick={(e) => {
                        e.stopPropagation() // ✅ 버튼 클릭 시 팝업이 닫히지 않도록 설정
                        setTimeout(() => {
                          setOpen(false)
                          if (item.href.startsWith('http')) {
                            window.open(
                              item.href,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          } else {
                            window.location.href = item.href
                          }
                        }, 100) // ✅ 클릭 후 닫히도록 설정
                      }}
                      className={`w-full group flex items-center gap-2 py-2 pr-3 ${
                        'indent' in item && item.indent ? 'pl-6 text-gray-600' : 'pl-3 text-gray-900'
                      } text-xs outline-none hover:bg-gray-100 focus:bg-gray-100 transition-colors`}
                    >
                      {item.href.startsWith('http') ? (
                        <span className="external relative">{item.title}</span>
                      ) : (
                        item.title
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommandPalette
