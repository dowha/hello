'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/supabase'
import { OWNER_EMAIL } from '@/lib/site'

export function useOwner() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // 여기선 UI 노출만 제어하고, 실제 쓰기 권한은 Supabase RLS가 확인한다
  return { user, loading, isOwner: user?.email === OWNER_EMAIL }
}

/** 저장·삭제 후 홈·이력서를 바로 다시 만들게 요청한다. 실패해도 10분 안에 저절로 반영되므로 저장 흐름은 막지 않는다 */
export async function refreshSite() {
  try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return
    const res = await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) console.error('사이트 갱신 요청 실패:', res.status)
  } catch (e) {
    console.error('사이트 갱신 요청 실패:', e)
  }
}

export const loginWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/wave` },
  })

export async function logout() {
  // local: 이 브라우저의 이 사이트 세션만 끊는다.
  // 기본값(global)은 같은 계정의 모든 세션을 끊어 blog.dowha.kim /desk까지 로그아웃시킨다.
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) {
    // 서버에 이미 없는 세션이면(session_not_found) auth-js가 저장된 세션을 지우지 않아
    // 로그아웃이 안 되는 것처럼 보인다 → 직접 지운다
    Object.keys(localStorage)
      .filter((k) => k.startsWith('sb-') && k.includes('-auth-token'))
      .forEach((k) => localStorage.removeItem(k))
  }
  // 로그아웃하면 사이트 첫 화면으로 돌아간다
  window.location.href = '/'
}
