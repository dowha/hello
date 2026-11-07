'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useOwner, loginWithGoogle, logout } from '@/lib/owner'
import { AboutEditor } from '@/components/wave/about-editor'
import { TimelineEditor } from '@/components/wave/timeline-editor'
import { ResumeEditor } from '@/components/wave/resume-editor'

type Tab = 'about' | 'timeline' | 'resume'
const TABS: { key: Tab; label: string }[] = [
  { key: 'about', label: '소개' },
  { key: 'timeline', label: '타임라인' },
  { key: 'resume', label: '이력서' },
]

const isTab = (v: string): v is Tab => TABS.some((t) => t.key === v)

/** 홈 아바타를 더블클릭해서 들어오는 관리자 페이지 (blog.dowha.kim /desk와 같은 방식) */
export default function WavePage() {
  const { user, loading, isOwner } = useOwner()
  const [tab, setTab] = useState<Tab>('about')

  // 새로고침해도 보던 탭 유지 (#timeline 등)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (isTab(hash)) setTab(hash)
  }, [])

  const changeTab = (t: Tab) => {
    setTab(t)
    history.replaceState(null, '', `#${t}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {loading ? (
        <p className="text-xs text-gray-400">확인 중…</p>
      ) : !user ? (
        <div className="flex justify-center py-24">
          <button
            onClick={loginWithGoogle}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            🔐 관리자 로그인
          </button>
        </div>
      ) : !isOwner ? (
        <div className="flex flex-col items-start gap-2 py-16">
          <p className="text-sm text-gray-600">접근 권한이 없는 계정입니다. ({user.email})</p>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600">
            로그아웃
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-lg text-gray-800">
              Wave
              {/* 로그아웃은 제목 옆 *로 숨긴다 (/desk와 동일) */}
              <button
                onClick={logout}
                title="로그아웃"
                aria-label="로그아웃"
                className="ml-1 align-super text-sm text-gray-300 hover:text-gray-600"
              >
                *
              </button>
            </h1>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-700">
              홈으로 →
            </Link>
          </div>

          <div className="mb-6 flex gap-1 border-b border-gray-100 text-sm">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => changeTab(key)}
                className={`-mb-px border-b-2 px-3 py-2 ${
                  tab === key ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 탭을 옮겨도 저장 안 한 편집 내용이 남도록 숨기기만 한다 */}
          <div hidden={tab !== 'about'}><AboutEditor /></div>
          <div hidden={tab !== 'timeline'}><TimelineEditor /></div>
          <div hidden={tab !== 'resume'}><ResumeEditor /></div>
        </>
      )}
    </div>
  )
}
