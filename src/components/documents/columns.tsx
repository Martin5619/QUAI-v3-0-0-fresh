'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Document_v2414, QuestionSet_v2414 } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export type DocumentWithQuestionSets_v2414 = Document_v2414 & {
  questionSets_v2414: (QuestionSet_v2414 & {
    questions_v2414: { id: string }[]
  })[]
}

interface ColumnsOptions {
  onDelete: (id: string) => void
  showGenerateButton?: boolean
}

export function createColumns({ onDelete, showGenerateButton = true }: ColumnsOptions): ColumnDef<DocumentWithQuestionSets_v2414>[] {
  return [
    {
      accessorKey: "title",
      header: "Document",
      cell: ({ row }) => {
        const doc = row.original
        return (
          <div className="flex flex-col">
            <Link 
              href={`/documents/${doc.id}`}
              className="font-medium hover:underline"
            >
              {doc.title}
            </Link>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "questionSets_v2414",
      header: "Question Sets",
      cell: ({ row }) => {
        const questionSets = row.original.questionSets_v2414
        return (
          <div className="text-sm">
            {questionSets.length} sets ({questionSets.reduce((acc, qs) => acc + qs.questions_v2414.length, 0)} questions)
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const doc = row.original
        return (
          <div className="flex items-center gap-2">
            {showGenerateButton && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <Link href={`/documents/${doc.id}/generate`}>
                  Generate
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(doc.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    }
  ]
}
