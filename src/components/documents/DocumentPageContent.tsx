'use client'

import { useRouter } from 'next/navigation'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { DocumentList } from '@/components/documents/DocumentList'
import { DocumentLimitWarning } from '@/components/documents/DocumentLimitWarning'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface UsageStats {
  documentsInUse: number
  totalDocuments: number
  monthlyUploadsUsed: number
  monthlyUploadLimit: number
}

export function DocumentPageContent() {
  const router = useRouter()
  const [documentCount, setDocumentCount] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userPlan, setUserPlan] = useState<{ limit: number, isUnlimited: boolean }>({ limit: 5, isUnlimited: false })
  const [usageStats, setUsageStats] = useState<UsageStats>({
    documentsInUse: 0,
    totalDocuments: 0,
    monthlyUploadsUsed: 0,
    monthlyUploadLimit: 5
  })

  // Fetch document count, user plan, and usage stats
  useEffect(() => {
    const fetchDocumentCount = async () => {
      try {
        const response = await fetch('/api/documents/count')
        if (!response.ok) {
          throw new Error('Failed to fetch document count')
        }
        const data = await response.json()
        setDocumentCount(data.totalDocuments)
        setUserPlan({ 
          limit: data.limit, 
          isUnlimited: data.isUnlimited 
        })
        setUsageStats({
          documentsInUse: data.totalDocuments,
          totalDocuments: data.totalDocuments,
          monthlyUploadsUsed: data.monthlyDocuments,
          monthlyUploadLimit: data.limit
        })
      } catch (error) {
        console.error('Error fetching document count:', error)
        toast.error('Failed to fetch document count')
      }
    }

    fetchDocumentCount()
  }, [refreshTrigger])

  const usagePercent = (usageStats.monthlyUploadsUsed / usageStats.monthlyUploadLimit) * 100

  // Handle successful upload
  const onUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setDocumentCount(prev => prev + 1)
    setUsageStats(prev => ({
      ...prev,
      totalDocuments: prev.totalDocuments + 1,
      monthlyUploadsUsed: prev.monthlyUploadsUsed + 1
    }))

    const returnTo = localStorage.getItem('returnTo')
    if (returnTo) {
      localStorage.removeItem('returnTo')
      router.push(returnTo)
    }
  }

  const onDocumentDeleted = async () => {
    // Refresh document count and usage stats
    try {
      const response = await fetch('/api/documents/count')
      if (!response.ok) {
        throw new Error('Failed to fetch updated document count')
      }
      const data = await response.json()
      setDocumentCount(data.totalDocuments)
      setUserPlan({ 
        limit: data.limit, 
        isUnlimited: data.isUnlimited 
      })
      setUsageStats({
        documentsInUse: data.totalDocuments,
        totalDocuments: data.totalDocuments,
        monthlyUploadsUsed: data.monthlyDocuments,
        monthlyUploadLimit: data.limit
      })
    } catch (error) {
      console.error('Error updating document stats:', error)
      toast.error('Failed to update document stats')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Documents</h2>
      
      {/* Monthly document usage progress */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Monthly Document Usage</span>
          <span>{usageStats.monthlyUploadsUsed} / {usageStats.monthlyUploadLimit}</span>
        </div>
        <Progress value={(usageStats.monthlyUploadsUsed / usageStats.monthlyUploadLimit) * 100} className="h-2" />
      </div>

      {/* Document upload section */}
      <div className="mt-8">
        <DocumentUpload onUploadComplete={() => {
          setRefreshTrigger(prev => prev + 1)
          onDocumentDeleted() // Refresh stats after upload
        }} />
      </div>

      {/* Document list */}
      <div className="mt-8">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <DocumentList
            onDocumentDeleted={onDocumentDeleted}
            showWelcomeOnEmpty={true}
            refreshTrigger={refreshTrigger}
          />
        </Suspense>
      </div>
    </div>
  )
}
