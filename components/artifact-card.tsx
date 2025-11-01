"use client"

import { FileText, FileCode, Database, FileJson, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Artifact } from "@/lib/types"

interface ArtifactCardProps {
  artifact: Artifact
  onSelect: () => void
}

export function ArtifactCard({ artifact, onSelect }: ArtifactCardProps) {
  const getIcon = () => {
    switch (artifact.type) {
      case "markdown":
        return <FileText className="h-4 w-4" />
      case "python":
        return <FileCode className="h-4 w-4 text-green-500" />
      case "json":
        return <FileJson className="h-4 w-4 text-orange-500" />
      case "sql":
        return <Database className="h-4 w-4 text-blue-500" />
      case "html":
        return <Code className="h-4 w-4 text-red-500" />
    }
  }

  const getTypeLabel = () => {
    return artifact.type.toUpperCase()
  }

  return (
    <Button
      variant="outline"
      className="flex h-auto w-full max-w-full items-start gap-3 p-3 text-left hover:bg-accent bg-transparent overflow-hidden"
      onClick={onSelect}
    >
      <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0 space-y-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{getTypeLabel()}</span>
        </div>
        <div className="font-medium break-words [overflow-wrap:anywhere]">{artifact.title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2 break-words [overflow-wrap:anywhere]">
          {artifact.summary}
        </div>
      </div>
    </Button>
  )
}
