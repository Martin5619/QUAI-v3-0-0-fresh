"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
            <Icons.warning className="h-10 w-10 text-destructive" />
            <h2 className="mt-4 text-2xl font-bold">Something went wrong!</h2>
            <p className="mb-4 mt-2 text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              <Icons.refresh className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
