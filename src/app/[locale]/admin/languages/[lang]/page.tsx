import { notFound } from "next/navigation"
import { TranslationEditor_v2414 } from "@/components/admin/languages/translation-editor"
import { TranslationStats_v2414 } from "@/components/admin/languages/translation-stats"
import { localeConfig, type Locale } from "@/i18n.config"
import { Button } from "@/components/ui/button"
import { Download, Upload, Wand2 } from "lucide-react"

interface Props {
  params: {
    lang: string
  }
}

export default async function TranslationPage({ params }: Props) {
  const lang = params.lang as Locale

  if (!localeConfig[lang]) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {localeConfig[lang].name} Translations
          </h2>
          <p className="text-muted-foreground">
            Manage translations for {localeConfig[lang].name}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Wand2 className="mr-2 h-4 w-4" />
            Auto-translate Missing
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TranslationStats_v2414
          title="Total Strings"
          value="1,234"
          description="Total number of translatable strings"
        />
        <TranslationStats_v2414
          title="Translated"
          value="989"
          description="Strings with translations"
          percentage={80}
        />
        <TranslationStats_v2414
          title="Missing"
          value="245"
          description="Strings requiring translation"
          percentage={20}
          showAsWarning
        />
      </div>

      <TranslationEditor_v2414 locale={lang} />
    </div>
  )
}
