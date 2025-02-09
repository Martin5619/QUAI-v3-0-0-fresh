"use client"

import { useState } from "react"
import { type Locale } from "@/i18n.config"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Wand2, Save, History } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface TranslationItem_v2414 {
  key: string
  source: string
  translation: string
  status: "translated" | "untranslated" | "needs-review"
  lastUpdated: string
}

const mockTranslations_v2414: TranslationItem_v2414[] = [
  {
    key: "app.name",
    source: "QUAi",
    translation: "",
    status: "untranslated",
    lastUpdated: "Never",
  },
  {
    key: "app.tagline",
    source: "Transform Learning with AI-Powered Assessment",
    translation: "Transformez l'apprentissage avec l'évaluation alimentée par l'IA",
    status: "translated",
    lastUpdated: "2025-02-08",
  },
  {
    key: "nav.features",
    source: "Features",
    translation: "Fonctionnalités",
    status: "translated",
    lastUpdated: "2025-02-08",
  },
  {
    key: "nav.pricing",
    source: "Pricing",
    translation: "",
    status: "untranslated",
    lastUpdated: "Never",
  },
]

export const TranslationEditor_v2414 = ({ locale }: { locale: Locale }) => {
  const [translations, setTranslations] = useState(mockTranslations_v2414)
  const [filter, setFilter] = useState<"all" | "untranslated" | "translated" | "needs-review">("all")
  const [search, setSearch] = useState("")

  const filteredTranslations = translations.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter
    const matchesSearch =
      search === "" ||
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleTranslationChange = (key: string, value: string) => {
    setTranslations(
      translations.map((item) =>
        item.key === key
          ? {
              ...item,
              translation: value,
              status: value ? "translated" : "untranslated",
              lastUpdated: value ? new Date().toISOString().split("T")[0] : item.lastUpdated,
            }
          : item
      )
    )
  }

  const handleAutoTranslate = async (key: string) => {
    // TODO: Implement AI translation
    console.log("Auto-translating:", key)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search translations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="translated">Translated</SelectItem>
            <SelectItem value="untranslated">Untranslated</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Key</TableHead>
              <TableHead>Source Text</TableHead>
              <TableHead>Translation</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTranslations.map((item) => (
              <TableRow key={item.key}>
                <TableCell className="font-mono text-sm">{item.key}</TableCell>
                <TableCell>
                  <div className="max-w-[300px] break-words">{item.source}</div>
                </TableCell>
                <TableCell>
                  <Textarea
                    value={item.translation}
                    onChange={(e) => handleTranslationChange(item.key, e.target.value)}
                    placeholder="Enter translation..."
                    className="min-h-[60px]"
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "translated"
                        ? "default"
                        : item.status === "needs-review"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Last updated: {item.lastUpdated}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAutoTranslate(item.key)}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <History className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
