"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <Icons.warning className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-4 mt-2 text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => reset()}>
          <Icons.refresh className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}
