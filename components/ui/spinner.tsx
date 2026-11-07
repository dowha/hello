/** 두 사이트 공통 로딩 표시: 글자 없이 회색 원만 돈다 (blog.dowha.kim과 동일) */
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={`flex items-center justify-center ${className}`}>
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
    </div>
  )
}
