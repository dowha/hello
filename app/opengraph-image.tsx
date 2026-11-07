import { ImageResponse } from 'next/og'
import { LOGO_PATHS, MARK_PATHS } from '@/components/brand'

// 링크 공유용 대표 이미지 (빌드 때 정적 생성, 하위 페이지에도 상속)
export const alt = 'dowha kim — Digital Maker | B2B SaaS Specialist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BRAND = '#0086FF'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative',
        }}
      >
        {/* 워드마크 'dowha kim' */}
        <svg width="640" height="100" viewBox="46 117 1023 160" fill={BRAND}>
          {LOGO_PATHS.map((d) => (
            <path key={d.slice(0, 16)} d={d} />
          ))}
        </svg>
        <div style={{ width: 48, height: 2, background: '#e5e7eb', margin: '44px 0 36px' }} />
        <div style={{ fontSize: 34, color: '#4b5563', letterSpacing: -0.5 }}>
          Digital Maker | B2B SaaS Specialist
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 26,
            color: '#9ca3af',
          }}
        >
          <svg width="26" height="25" viewBox="0 17 902 862" fill={BRAND}>
            {MARK_PATHS.map((d) => (
              <path key={d.slice(0, 16)} d={d} />
            ))}
          </svg>
          dowha.kim
        </div>
      </div>
    ),
    size
  )
}
