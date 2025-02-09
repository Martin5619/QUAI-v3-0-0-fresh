"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface SubscriptionFormProps {
  userId: string
  subscription: {
    plan: string
    status: string
    expiresAt?: Date
    cancelAtPeriodEnd?: boolean
  } | null
}

export function SubscriptionForm({ userId, subscription }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const t = useTranslations("settings.subscription")

  async function handleUpgrade() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error("Failed to start upgrade process")

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      toast.error("Failed to start upgrade process")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancel() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error("Failed to cancel subscription")

      toast.success("Subscription cancelled successfully")
      setShowCancelDialog(false)
    } catch (error) {
      toast.error("Failed to cancel subscription")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReactivate() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/billing/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error("Failed to reactivate subscription")

      toast.success("Subscription reactivated successfully")
    } catch (error) {
      toast.error("Failed to reactivate subscription")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("currentPlan")}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              {subscription?.plan || "Free"}
            </span>
            <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
              {subscription?.status || "Free"}
            </Badge>
          </div>
        </div>
        {subscription?.expiresAt && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("nextBilling")}</h3>
            <p>{new Date(subscription.expiresAt).toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="space-x-2">
        {!subscription || subscription.plan === "free" ? (
          <Button onClick={handleUpgrade} disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t("upgrade")}
          </Button>
        ) : subscription.cancelAtPeriodEnd ? (
          <Button onClick={handleReactivate} disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t("reactivate")}
          </Button>
        ) : (
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">{t("cancel")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Subscription</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your subscription? You'll
                  continue to have access until the end of your billing period.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cancel Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}
