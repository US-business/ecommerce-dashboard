"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Don't catch redirect errors - let them bubble up
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Don't log redirect errors
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }

    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{this.state.error?.message || "An unexpected error occurred"}</p>
              <div className="space-y-2">
                <Button onClick={() => this.setState({ hasError: false, error: undefined })} className="w-full">
                  Try again
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  Go to home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
