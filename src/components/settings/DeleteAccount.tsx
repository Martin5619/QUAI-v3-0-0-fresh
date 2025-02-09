'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function DeleteAccount() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  const handleDelete = async () => {
    if (confirmation.toLowerCase() !== 'delete my account') {
      toast.error('Please type the confirmation phrase exactly')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      toast.success('Your account has been deleted')
      setOpen(false)
      // Sign out and redirect to home
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-destructive">
                Type &quot;delete my account&quot; to confirm
              </Label>
              <Input
                id="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="col-span-3"
                autoComplete="off"
                autoCorrect="off"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || confirmation.toLowerCase() !== 'delete my account'}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
