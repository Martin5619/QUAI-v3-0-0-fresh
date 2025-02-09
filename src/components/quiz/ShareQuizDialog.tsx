'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Share2, Copy, Check, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Group {
  id: string
  name: string
  type: string
}

interface ShareQuizDialogProps {
  questionSetId: string
  isPublic: boolean
  accessCode?: string | null
}

export function ShareQuizDialog({ questionSetId, isPublic: initialIsPublic, accessCode: initialAccessCode }: ShareQuizDialogProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [accessCode, setAccessCode] = useState(initialAccessCode || '')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')

  useEffect(() => {
    // Fetch user's groups
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups_v2414')
        if (!response.ok) throw new Error('Failed to fetch groups')
        const data = await response.json()
        setGroups(data)
      } catch (error) {
        console.error('Error fetching groups:', error)
        toast.error('Failed to load groups')
      }
    }

    fetchGroups()
  }, [])

  const handleShareUpdate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/quiz_v2414/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSetId,
          isPublic,
          accessCode: accessCode || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update sharing settings')
      }

      const data = await response.json()
      setAccessCode(data.accessCode || '')
      toast.success('Sharing settings updated successfully')
    } catch (error) {
      console.error('Error updating sharing settings:', error)
      toast.error('Failed to update sharing settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGroupShare = async () => {
    if (!selectedGroupId) {
      toast.error('Please select a group')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/quiz_v2414/share/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSetId,
          groupId: selectedGroupId,
          expiresAt: expiryDate ? new Date(expiryDate).toISOString() : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to share with group')
      }

      toast.success('Successfully shared with group')
      setSelectedGroupId('')
      setExpiryDate('')
    } catch (error) {
      console.error('Error sharing with group:', error)
      toast.error('Failed to share with group')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/quiz/take/${questionSetId}${!isPublic ? `?code=${accessCode}` : ''}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="group">Share with Group</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="public">Make quiz public</Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {!isPublic && (
              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code or leave blank to generate"
                />
              </div>
            )}

            <Button
              onClick={handleShareUpdate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Update Sharing Settings'}
            </Button>

            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex space-x-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/quiz/take/${questionSetId}${
                    !isPublic ? `?code=${accessCode}` : ''
                  }`}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Group</Label>
                <Select
                  value={selectedGroupId}
                  onValueChange={setSelectedGroupId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{group.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({group.type})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <Input
                  id="expiry"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGroupShare}
                disabled={isLoading || !selectedGroupId}
                className="w-full"
              >
                {isLoading ? 'Sharing...' : 'Share with Group'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
