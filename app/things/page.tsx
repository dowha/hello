import { Suspense } from 'react'
import Things from '@/components/projects'
import GNB from '@/components/ui/gnb'

export const metadata = {
  title: 'Things I have made',
  description: 'Explore my creations, including live services, experiments, toy projects, learning exercises, and legacy works, reflecting my identity as a digital maker.',
  openGraph: {
    title: 'Things I have made.',
    description: 'Explore my creations, including live services, experiments, toy projects, learning exercises, and legacy works, reflecting my identity as a digital maker.',
  },
}

export default function ThingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <GNB showLanguage={false} showTheme={true} /> 
      <Things />
    </Suspense>
  )
}
