/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dowha.kim', // 여기에 실제 도메인을 입력하세요
  generateRobotsTxt: true, // robots.txt 자동 생성
  sitemapSize: 5000, // (선택) sitemap 분할 크기
  changefreq: 'daily', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
  priority: 1, // 페이지 주소 우선순위 (검색엔진에 제공됨, 우선순위가 높은 순서대로 크롤링함)
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
  },
}
