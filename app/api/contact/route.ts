import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 연락 폼 처리 (DO-81)
 * 입력 검증 → 숨김 필드 확인 → Turnstile 서버 검증 → DB 저장(횟수 제한 포함) → Resend로 알림 메일
 *
 * 환경 변수(서버 전용)
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile 비밀 키
 * - CONTACT_FORM_SECRET: DB 저장 함수가 확인하는 비밀값 (DB에는 해시만 있음)
 * - RESEND_API_KEY: Resend 발송 전용 키 (메일함 접근 권한 없음)
 * - CONTACT_MAIL_TO: 알림을 받을 주소
 * - CONTACT_MAIL_FROM: (선택) 보내는 주소. 기본값은 Resend 공용 주소라 Resend 가입 주소로만 보낼 수 있다
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIMITS = { name: 100, email: 254, message: 5000 }
const EMAIL_PATTERN = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/

type Body = {
  name?: unknown
  email?: unknown
  message?: unknown
  lang?: unknown
  website?: unknown // 숨김 필드: 사람에게는 보이지 않아 봇만 채운다
  token?: unknown
}

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status })

// 메일 헤더(제목·이름)에 줄바꿈이 섞이지 않게 한 줄로 만든다
const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, ' ').trim()

// Cloudflare 프록시를 거치므로 실제 방문자 IP는 cf-connecting-ip에 있다.
// 단, Vercel 주소로 직접 보내면 이 헤더를 꾸밀 수 있어 IP 제한은 보조 수단이다
// (DB 함수가 이메일당·전체 횟수 제한도 함께 건다)
function clientIp(req: NextRequest) {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    ''
  )
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false
  const form = new URLSearchParams({ secret, response: token })
  if (ip) form.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const formSecret = process.env.CONTACT_FORM_SECRET
  const resendKey = process.env.RESEND_API_KEY
  const mailTo = process.env.CONTACT_MAIL_TO
  // 도메인 인증 없이 쓰는 Resend 기본 발신 주소 (가입한 본인 주소로만 보낼 수 있음). 도메인 인증 후엔 CONTACT_MAIL_FROM으로 바꾼다
  const mailFrom = process.env.CONTACT_MAIL_FROM || 'dowha.kim 연락 폼 <onboarding@resend.dev>'
  if (!formSecret || !process.env.TURNSTILE_SECRET_KEY) {
    console.error('[contact] 서버 설정(환경 변수)이 비어 있음')
    return fail(500, 'server_config')
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return fail(400, 'invalid')
  }

  // 봇이 숨김 필드를 채웠으면 성공한 것처럼 응답하고 아무것도 하지 않는다
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = typeof body.name === 'string' ? oneLine(body.name) : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.replace(/\r\n/g, '\n').trim() : ''
  const lang = body.lang === 'en' ? 'en' : 'ko'
  const token = typeof body.token === 'string' ? body.token : ''

  if (
    name.length > LIMITS.name ||
    !email ||
    email.length > LIMITS.email ||
    !EMAIL_PATTERN.test(email) ||
    !message ||
    message.length > LIMITS.message
  ) {
    return fail(400, 'invalid')
  }
  if (!token) return fail(400, 'captcha')

  const ip = clientIp(req)
  if (!(await verifyTurnstile(token, ip))) return fail(403, 'captcha')

  // IP 원문은 저장하지 않고 비밀값을 섞은 해시만 남긴다 (횟수 제한용)
  const ipHash = ip ? createHash('sha256').update(`${ip}:${formSecret}`).digest('hex') : null
  const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 500)

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  })
  const { data: id, error } = await db.rpc('submit_contact_message', {
    p_secret: formSecret,
    p_name: name || null,
    p_email: email,
    p_message: message,
    p_lang: lang,
    p_ip_hash: ipHash,
    p_user_agent: userAgent,
  })
  if (error) {
    if (error.message === 'rate_limited') return fail(429, 'rate_limited')
    console.error('[contact] 저장 실패', error.code, error.message)
    return fail(500, 'save_failed')
  }

  // 메일 발송은 실패해도 메시지는 DB에 남아 있으므로 방문자에게는 성공으로 응답한다
  if (resendKey && mailTo) {
    const sentAt = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul', hour12: false })
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: mailFrom,
          to: [mailTo],
          // 메일함에서 '답장'을 누르면 방문자에게 간다. 이름을 넣으면 쉼표 등으로 수신자를 끼워 넣을 수 있어 검증된 주소만 쓴다
          reply_to: email,
          subject: oneLine(`[dowha.kim] ${name || email}`),
          text: [
            `이름: ${name || '(없음)'}`,
            `이메일: ${email}`,
            `언어: ${lang}`,
            `보낸 시각: ${sentAt} (KST)`,
            '',
            message,
          ].join('\n'),
        }),
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        await db.rpc('mark_contact_emailed', { p_secret: formSecret, p_id: id })
      } else {
        console.error('[contact] 메일 발송 실패', res.status, (await res.text()).slice(0, 300))
      }
    } catch (e) {
      console.error('[contact] 메일 발송 실패', e instanceof Error ? e.message : e)
    }
  } else {
    console.error('[contact] Resend 환경 변수가 없어 메일을 보내지 않음 (DB에는 저장됨)')
  }

  return NextResponse.json({ ok: true })
}
