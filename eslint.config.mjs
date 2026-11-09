// ESLint 설정 (next lint 대신 ESLint CLI로 실행: npm run lint)
// eslint-config-next 15는 예전 형식(.eslintrc) 설정이라 FlatCompat으로 불러온다 (blog와 같은 방식)
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const eslintConfig = [
  // next lint가 검사하지 않던 빌드 결과물·자동 생성 파일은 제외
  { ignores: ['.next/**', 'out/**', 'public/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
