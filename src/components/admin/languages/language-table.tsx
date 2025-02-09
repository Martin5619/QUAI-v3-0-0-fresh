"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Upload, Edit, Trash } from "lucide-react"
import { localeConfig, type Locale } from "@/i18n.config"

interface LanguageData_v2414 {
  locale: Locale
  translationProgress: number
  lastUpdated: string
  status: "active" | "draft" | "archived"
  missingStrings: number
}

const languageData_v2414: LanguageData_v2414[] = Object.entries(localeConfig).map(
  ([locale, config]) => ({
    locale: locale as Locale,
    translationProgress: Math.floor(Math.random() * 30) + 70, // 70-100%
    lastUpdated: "2025-02-08",
    status: Math.random() > 0.3 ? "active" : "draft",
    missingStrings: Math.floor(Math.random() * 100),
  })
)

export const LanguageTable_v2414 = () => {
  const [languages, setLanguages] = useState(languageData_v2414)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Language</TableHead>
            <TableHead>Translation Progress</TableHead>
            <TableHead>Missing Strings</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.locale}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {localeConfig[language.locale].name}
                  {localeConfig[language.locale].dir === "rtl" && (
                    <Badge variant="secondary">RTL</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={language.translationProgress} className="w-[60px]" />
                  <span className="text-sm text-muted-foreground">
                    {language.translationProgress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>{language.missingStrings}</TableCell>
              <TableCell>{language.lastUpdated}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    language.status === "active"
                      ? "default"
                      : language.status === "draft"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {language.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit translations
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Import translations
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export translations
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete language
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
