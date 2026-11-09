// 서버·클라이언트 양쪽에서 쓰는 사이트 상수 ('use client' 파일에서 가져오면 서버에서 못 쓰므로 분리)

// 관리자(/wave) 소유자 이메일. blog.dowha.kim /desk와 동일.
// 실제 보안은 Supabase RLS(쓰기 = 이 이메일)에서 강제한다.
export const OWNER_EMAIL = 'mail@dowha.kim'
