// /wave에서 저장·삭제한 뒤 홈·이력서를 바로 다시 만든다 (오너만)
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { OWNER_EMAIL } from '@/lib/site'

const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  // 토큰 서명·만료는 Supabase가 확인한다
  const { data, error } = await auth.auth.getUser(token)
  if (error || data.user?.email !== OWNER_EMAIL) {
    return Response.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  // 실제 페이지는 언어별 내부 경로(app/[lang])에 있다
  revalidatePath('/[lang]', 'page')
  revalidatePath('/[lang]/resume', 'page')
  return Response.json({ ok: true })
}
