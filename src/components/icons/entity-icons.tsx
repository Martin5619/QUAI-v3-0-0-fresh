"use client"

import { FileText, HelpCircle, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
}

export const EntityIcons = {
  Document: ({ className }: IconProps) => (
    <FileText className={cn("text-blue-500", className)} />
  ),
  Question: ({ className }: IconProps) => (
    <HelpCircle className={cn("text-green-500", className)} />
  ),
  default: ({ className }: IconProps) => (
    <File className={cn("text-gray-500", className)} />
  )
}

export const EntityColors = {
  document: "text-blue-500 dark:text-blue-400",
  question: "text-green-500 dark:text-green-400",
  default: "text-gray-500 dark:text-gray-400"
} as const

// Background colors for entity cards
export const EntityBackgrounds = {
  document: "bg-blue-50 dark:bg-blue-950",
  question: "bg-green-50 dark:bg-green-950",
  default: "bg-gray-50 dark:bg-gray-950"
} as const

// Border colors for entity cards
export const EntityBorders = {
  document: "border-blue-200 dark:border-blue-800",
  question: "border-green-200 dark:border-green-800",
  default: "border-gray-200 dark:border-gray-800"
} as const
