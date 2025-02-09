'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Command } from 'cmdk'
import { Search, X, FileText, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/api-utils'

interface Document {
  id: string
  title: string
  fileName: string
  createdAt: string
  questionSets: Array<{
    questionSet: {
      id: string
      displayNumber: number
      createdAt: string
    }
  }>
}

interface DocumentSelectorProps {
  selectedDocuments: Document[]
  onDocumentsChange: (documents: Document[]) => void
}

export function DocumentSelector({
  selectedDocuments,
  onDocumentsChange,
}: DocumentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch documents only once on mount
  useEffect(() => {
    let mounted = true
    const fetchDocuments = async () => {
      if (!mounted) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await apiRequest<{ documents: Document[] }>('/api/documents_v2414')
        
        if (mounted) {
          if (!response?.documents) {
            throw new Error('No documents found')
          }
          setDocuments(response.documents)
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching documents:', error)
          setError(error instanceof Error ? error.message : 'Failed to load documents')
          setDocuments([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDocuments()
    return () => {
      mounted = false
    }
  }, [])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Memoize filtered documents
  const filteredDocuments = useMemo(() => {
    if (!search) return documents
    const searchLower = search.toLowerCase()
    return documents.filter(doc => 
      doc.title?.toLowerCase().includes(searchLower) ||
      doc.fileName.toLowerCase().includes(searchLower)
    )
  }, [documents, search])

  // Memoize handlers
  const handleToggleDocument = useCallback((document: Document) => {
    const isSelected = selectedDocuments.some(d => d.id === document.id)
    if (isSelected) {
      onDocumentsChange(selectedDocuments.filter(d => d.id !== document.id))
    } else {
      onDocumentsChange([...selectedDocuments, document])
    }
  }, [selectedDocuments, onDocumentsChange])

  const handleRemoveDocument = useCallback((documentId: string) => {
    onDocumentsChange(selectedDocuments.filter(d => d.id !== documentId))
  }, [selectedDocuments, onDocumentsChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Selected documents */}
      <div className="flex flex-wrap gap-2">
        {selectedDocuments.map((doc) => (
          <Badge
            key={doc.id}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            <FileText className="h-3 w-3" />
            <span>{doc.title || doc.fileName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveDocument(doc.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Document selector dropdown */}
      <Command className="border rounded-lg">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search documents..."
            className="flex h-10 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading documents...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No documents found</div>
        ) : (
          <Command.List className="max-h-[200px] overflow-y-auto p-2">
            {filteredDocuments.map((doc) => (
              <Command.Item
                key={doc.id}
                onSelect={() => handleToggleDocument(doc)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm"
              >
                <FileText className="h-4 w-4" />
                <span>{doc.title || doc.fileName}</span>
                {selectedDocuments.some((d) => d.id === doc.id) && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </Command.Item>
            ))}
          </Command.List>
        )}
      </Command>
    </div>
  )
}
