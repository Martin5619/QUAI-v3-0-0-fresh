import { Metadata } from "next"
import { LanguageTable_v2414 } from "@/components/admin/languages/language-table"
import { LanguageStats_v2414 } from "@/components/admin/languages/language-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Language Management - QUAi Admin",
  description: "Manage languages and translations for QUAi platform",
}

export default async function LanguagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Languages</h2>
          <p className="text-muted-foreground">
            Manage languages and translations for the platform.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <LanguageStats_v2414
          title="Active Languages"
          value="8"
          description="Languages currently available"
          trend="+2 this month"
        />
        <LanguageStats_v2414
          title="Translation Progress"
          value="92%"
          description="Overall translation completion"
          trend="+5% this month"
        />
        <LanguageStats_v2414
          title="Missing Translations"
          value="245"
          description="Strings requiring translation"
          trend="-120 this month"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Language Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure language settings and manage translations.
            </p>
          </div>
        </div>
        <LanguageTable_v2414 />
      </div>
    </div>
  )
}
