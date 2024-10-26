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
      <div className="flex items-center justify-center min-h-screen bg-white/30 backdrop-blur-sm">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-2 text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
    }
  >
      <GNB showLanguage={false} showTheme={true} /> 
      <Things />
    </Suspense>
  )
}
