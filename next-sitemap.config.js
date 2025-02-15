/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dowha.kim', // 여기에 실제 도메인을 입력하세요
  generateRobotsTxt: true, // robots.txt 자동 생성
  changefreq: 'daily', // 페이지 주소 변경 빈도
  sitemapSize: 50000, // 사이트맵 파일 1개로 생성
  generateIndexSitemap: false, // 인덱스 파일 비활성화 → sitemap-0.xml 방지
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7, // ✅ 홈페이지(`/`)는 1.0, 나머지는 0.7
    };
  },
  robotsTxtOptions: {
    policies: [
      // ✅ 1. 모든 크롤러(AI 포함)에 블로그 콘텐츠 크롤링 허용
      {
        userAgent: '*',
        allow: '/',
      },
      // ✅ 2. Googlebot (Google 검색용) 크롤링 허용
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      // ✅ 3. OpenAI 크롤러 허용 (AI 훈련 목적)
      {
        userAgent: 'OpenAI-GPT',
        allow: '/',
      },
      // ✅ 4. Microsoft Bing (Copilot 포함)
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      // ✅ 5. 기타 AI 크롤러 (Anthropic, Claude, Perplexity 등)
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
      },
      {
        userAgent: 'Claude',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
     additionalSitemaps: [
      'https://blog.dowha.kim/sitemap.xml',  // ✅ 서브도메인 사이트맵 추가
    ],
  },
};
