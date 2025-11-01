"use client"

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QueryStatusProps {
  status: "idle" | "loading" | "success" | "error"
  error?: string
  executionTime?: number
}

export function QueryStatus({ status, error, executionTime }: QueryStatusProps) {
  if (status === "idle") return null

  if (status === "loading") {
    return (
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertDescription className="text-sm">Executing query...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-sm text-destructive">{error || "Query execution failed"}</AlertDescription>
      </Alert>
    )
  }

  if (status === "success") {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-sm text-green-500">
          Query executed successfully {executionTime && `in ${executionTime}ms`}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
