'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/language'

// Turnstile 사이트 키는 공개용이라 코드에 기본값으로 둔다 (환경 변수가 있으면 그 값 우선)
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAGFWaCt8h2ARXq7j'

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const TEXT = {
  ko: {
    title: '연락하기',
    lead: '질문이나 피드백, 협업 제안 등 무엇이든 편하게 보내 주세요.',
    name: '이름',
    optional: '선택',
    email: '답장받을 이메일',
    message: '내용',
    send: '보내기',
    sending: '보내는 중…',
    done: '감사합니다. 빠르게 답장드리겠습니다.',
    errors: {
      invalid: '이메일과 내용을 확인해 주세요.',
      captcha: '로봇 확인이 끝나지 않았어요. 잠시 후 다시 보내 주세요.',
      rate_limited: '짧은 시간에 너무 많이 보냈어요. 한 시간쯤 뒤에 다시 시도해 주세요.',
      default: '보내지 못했어요. 잠시 후 다시 시도해 주세요.',
    },
  },
  en: {
    title: 'Contact',
    lead: 'Questions, feedback, or ideas to collaborate on — feel free to reach out.',
    name: 'Name',
    optional: 'optional',
    email: 'Your email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending…',
    done: 'Thank you. I will get back to you soon.',
    errors: {
      invalid: 'Please check your email and message.',
      captcha: 'The verification is not complete yet. Please try again in a moment.',
      rate_limited: 'Too many messages in a short time. Please try again in about an hour.',
      default: 'Something went wrong. Please try again later.',
    },
  },
} as const

type ErrorKey = keyof (typeof TEXT)['ko']['errors']

const inputCls =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-gray-400'

export default function ContactForm({ lang }: { lang: Language }) {
  const t = TEXT[lang]
  const router = useRouter()
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [scriptReady, setScriptReady] = useState(false)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')
  const [error, setError] = useState<ErrorKey | null>(null)

  // 스크립트가 이미 있으면(페이지 재방문) 바로 그린다
  useEffect(() => {
    if (window.turnstile) setScriptReady(true)
  }, [])

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !widgetRef.current || widgetId.current) return
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: SITE_KEY,
      language: lang,
      theme: 'light', // 사이트가 밝은 테마뿐이라 고정
      callback: (value: string) => setToken(value),
      'expired-callback': () => setToken(''),
      'error-callback': () => setToken(''),
    })
  }, [lang])

  useEffect(() => {
    if (scriptReady) renderWidget()
  }, [scriptReady, renderWidget])

  // 페이지를 떠나면 위젯 정리
  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = undefined
    },
    []
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    if (!token) {
      setError('captcha')
      return
    }
    const form = new FormData(e.currentTarget)
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
          website: form.get('website'),
          lang,
          token,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (res.ok && data.ok) {
        // 보냈으면 안내 토스트를 띄우고 홈으로 돌아간다 (토스트는 공통 틀에 있어 이동 후에도 보인다)
        toast.success(t.done)
        router.push('/')
        return
      }
      setError((data.error && data.error in t.errors ? data.error : 'default') as ErrorKey)
    } catch {
      setError('default')
    }
    // 토큰은 한 번만 쓸 수 있으므로 실패하면 새로 받는다
    window.turnstile?.reset(widgetId.current)
    setToken('')
    setStatus('idle')
  }

  return (
    <section className="w-full">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <h1 className="text-center">{t.title}</h1>
      <p className="mt-2 text-center text-sm text-gray-500 break-keep">{t.lead}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate={false}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-gray-700">
            {t.name} <span className="font-normal text-gray-400">({t.optional})</span>
          </span>
          <input name="name" type="text" maxLength={100} autoComplete="name" className={inputCls} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-gray-700">{t.email}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputCls} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-gray-700">{t.message}</span>
          <textarea name="message" required maxLength={5000} rows={7} className={`${inputCls} resize-y leading-relaxed`} />
        </label>

        {/* 숨김 필드: 화면·읽기 프로그램 모두에서 숨기고, 자동 입력도 막는다 */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div ref={widgetRef} className="min-h-[65px]" />

        {error && (
          <p className="text-sm text-warn break-keep" role="alert">
            {t.errors[error]}
          </p>
        )}

        {/* 페이지의 주요 동작이라 사이트 강조색(브랜드 파랑)을 쓴다 */}
        <Button type="submit" className="w-full bg-brand text-white hover:bg-brand-dark" disabled={status === 'sending'}>
          {status === 'sending' ? t.sending : t.send}
        </Button>
      </form>
    </section>
  )
}
