import { Inter, Noto_Sans_SC, Noto_Sans_TC, Noto_Sans_Arabic, Noto_Sans_Devanagari } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
})

export const notoSansChineseSimp = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-chinese-simp",
  display: "swap",
})

export const notoSansChineseTrad = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-chinese-trad",
  display: "swap",
})

export const notoSansHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  variable: "--font-hindi",
  display: "swap",
})
