import ClientHome from './ClientHome'
import { LanguagePending } from '@/components/language-pending'
import { getHomeData } from '@/lib/site-data'

// 서버에서 데이터를 넣어 그린 페이지를 10분마다 다시 만든다 (/wave 저장 시에는 바로).
export const revalidate = 600

export default async function Page() {
  const data = await getHomeData()
  return (
    <>
      <LanguagePending />
      <ClientHome data={data} />
    </>
  )
}
