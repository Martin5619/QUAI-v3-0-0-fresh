'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SUPPORTED_MIME_TYPES, getSupportedFileExtensions } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Document_v2414 } from '@prisma/client'

interface DocumentUploadProps {
  onUploadSuccess?: () => void
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [documentCount, setDocumentCount] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Fetch document count
  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchDocumentCount = async () => {
      try {
        // Check document count
        const response = await fetch('/api/documents/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setDocumentCount(data.totalDocuments)
        }
      } catch (error) {
        console.error('Error fetching document count:', error)
      }
    }
    fetchDocumentCount()
  }, [status])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (status !== 'authenticated' || !session) {
      toast.error('Please sign in to upload documents')
      return
    }

    if (acceptedFiles.length === 0) {
      toast.error('Please select a valid file')
      return
    }

    const file = acceptedFiles[0]
    
    // Validate file type
    if (!SUPPORTED_MIME_TYPES[file.type]) {
      toast.error(`Invalid file type. Supported formats: ${getSupportedFileExtensions().join(', ')}`)
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload file')
      }

      const data = await response.json()
      toast.success('Document uploaded successfully')
      router.refresh()
      onUploadSuccess?.()
      // Update local document count
      setDocumentCount(prev => prev + 1)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }, [status, session, router, onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(SUPPORTED_MIME_TYPES).reduce((acc, mimeType) => {
      acc[mimeType] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  })

  if (status === 'loading') {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      </Card>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-gray-600">
          Please sign in to upload documents
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer ${
          isDragActive ? 'border-primary bg-accent' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop your file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to select a file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: {getSupportedFileExtensions().join(', ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 5MB
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
