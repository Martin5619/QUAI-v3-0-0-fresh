import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LanguageState_v3 {
  language: string
  setLanguage: (language: string) => void
  resetLanguage: () => void
}

const DEFAULT_LANGUAGE = "en"

export const useLanguageStore_v3 = create<LanguageState_v3>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language: string) => set({ language }),
      resetLanguage: () => set({ language: DEFAULT_LANGUAGE }),
    }),
    {
      name: "quai-language-storage-v3",
    }
  )
)
