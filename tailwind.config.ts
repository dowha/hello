import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			/* 사이트 공통 색 (blog.dowha.kim · dowha.kim 동일하게 유지) */
  			page: '#FCFCFC', // 바탕
  			brand: { DEFAULT: '#0086FF', dark: '#006FD6', bg: '#eef6ff', border: '#b3dbff' }, // 주 색·링크 hover / 진한 파랑(선택·제안·버튼 hover) / 연한 배경·테두리
  			warn: { DEFAULT: '#c8481c', light: '#ee6033', dark: '#a93c17', bg: '#fef3ee', border: '#f8c8b5' }, // 경고·삭제 / N 배지 / hover / 연한 배경·테두리
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))'
  		}
  	}
  },
  plugins: [animate],
};
export default config;
