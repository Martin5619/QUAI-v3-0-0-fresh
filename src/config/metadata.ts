import { type Locale, type LocaleConfig, localeConfig } from "@/i18n.config"

interface MetadataConfig_v2414 {
  title: string
  description: string
  keywords: string[]
}

export const getMetadata_v2414 = (locale: Locale): MetadataConfig_v2414 => {
  const metadata: Record<Locale, MetadataConfig_v2414> = {
    en: {
      title: "QUAi - AI-Powered Assessment Platform",
      description:
        "Transform learning with AI-powered assessments. Create engaging quizzes and learning materials in seconds.",
      keywords: [
        "AI assessment",
        "education technology",
        "learning platform",
        "quiz generator",
        "AI education",
      ],
    },
    ar: {
      title: "كواي - منصة التقييم المدعومة بالذكاء الاصطناعي",
      description:
        "حول التعلم مع التقييمات المدعومة بالذكاء الاصطناعي. قم بإنشاء اختبارات ومواد تعليمية جذابة في ثوانٍ.",
      keywords: [
        "تقييم الذكاء الاصطناعي",
        "تكنولوجيا التعليم",
        "منصة التعلم",
        "مولد الاختبارات",
        "تعليم الذكاء الاصطناعي",
      ],
    },
    "zh-hans": {
      title: "QUAi - 人工智能驱动的评估平台",
      description:
        "通过人工智能驱动的评估转变学习。在几秒钟内创建引人入胜的测验和学习材料。",
      keywords: [
        "人工智能评估",
        "教育技术",
        "学习平台",
        "测验生成器",
        "人工智能教育",
      ],
    },
    "zh-hant": {
      title: "QUAi - 人工智能驅動的評估平台",
      description:
        "通過人工智能驅動的評估轉變學習。在幾秒鐘內創建引人入勝的測驗和學習材料。",
      keywords: [
        "人工智能評估",
        "教育技術",
        "學習平台",
        "測驗生成器",
        "人工智能教育",
      ],
    },
    hi: {
      title: "QUAi - एआई-संचालित मूल्यांकन प्लेटफ़ॉर्म",
      description:
        "एआई-संचालित मूल्यांकन के साथ सीखने को बदलें। सेकंडों में आकर्षक प्रश्नोत्तरी और सीखने की सामग्री बनाएं।",
      keywords: [
        "एआई मूल्यांकन",
        "शिक्षा प्रौद्योगिकी",
        "सीखने का प्लेटफ़ॉर्म",
        "प्रश्नोत्तरी जनरेटर",
        "एआई शिक्षा",
      ],
    },
    fr: {
      title: "QUAi - Plateforme d'évaluation alimentée par l'IA",
      description:
        "Transformez l'apprentissage avec des évaluations alimentées par l'IA. Créez des quiz et du matériel pédagogique captivants en quelques secondes.",
      keywords: [
        "évaluation IA",
        "technologie éducative",
        "plateforme d'apprentissage",
        "générateur de quiz",
        "éducation IA",
      ],
    },
    de: {
      title: "QUAi - KI-gestützte Bewertungsplattform",
      description:
        "Transformieren Sie das Lernen mit KI-gestützten Bewertungen. Erstellen Sie in Sekundenschnelle fesselnde Quiz und Lernmaterialien.",
      keywords: [
        "KI-Bewertung",
        "Bildungstechnologie",
        "Lernplattform",
        "Quiz-Generator",
        "KI-Bildung",
      ],
    },
    es: {
      title: "QUAi - Plataforma de evaluación impulsada por IA",
      description:
        "Transforma el aprendizaje con evaluaciones impulsadas por IA. Crea cuestionarios y materiales de aprendizaje cautivadores en segundos.",
      keywords: [
        "evaluación IA",
        "tecnología educativa",
        "plataforma de aprendizaje",
        "generador de cuestionarios",
        "educación IA",
      ],
    },
  }

  return metadata[locale]
}

export const getAlternateLanguageUrls_v2414 = (
  path: string,
  config: LocaleConfig
): Record<string, string> => {
  const alternates: Record<string, string> = {}
  Object.entries(config).forEach(([locale, _]) => {
    alternates[locale] = `/${locale}${path}`
  })
  return alternates
}
