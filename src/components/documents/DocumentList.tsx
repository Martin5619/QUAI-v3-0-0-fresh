'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { DataTable } from './data-table'
import { createColumns, type DocumentWithQuestionSets_v2414 } from './columns'

interface DocumentListProps {
  onDocumentDeleted?: () => void
  showWelcomeOnEmpty?: boolean
  showGenerateButton?: boolean
  refreshTrigger?: number
}

export function DocumentList({ 
  onDocumentDeleted, 
  showWelcomeOnEmpty = false,
  showGenerateButton = true,
  refreshTrigger = 0
}: DocumentListProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentWithQuestionSets_v2414[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/documents')
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to fetch documents')
        }
        
        const documents = await response.json()
        setDocuments(documents)
      } catch (error) {
        console.error('Error fetching documents:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch documents')
        toast.error('Failed to fetch documents')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/force-delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete document')
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id))
      toast.success('Document deleted')
      onDocumentDeleted?.()
    } catch (error) {
      console.error('[API_v2414] Error deleting document:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete document')
    }
  }

  const columns = createColumns({ 
    onDelete: handleDelete,
    showGenerateButton
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="flex items-center gap-2 p-4 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <p>{error}</p>
      </Card>
    )
  }

  if (documents.length === 0 && showWelcomeOnEmpty) {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <div>
          <h2 className="text-lg font-semibold">No documents yet</h2>
          <p className="text-sm text-muted-foreground">
            Upload your first document to get started
          </p>
        </div>
        <Button asChild>
          <Link href="/documents/upload">Upload Document</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={documents}
      />
    </div>
  )
}
