export {} // TypeScript 전역 선언을 위해 필요함

declare global {
  interface Window {
    dataLayer?: any[];
  }
}
