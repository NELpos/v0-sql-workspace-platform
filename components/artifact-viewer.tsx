"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Artifact } from "@/lib/types"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeViewer } from "@/components/code-viewer"

interface ArtifactViewerProps {
  artifact: Artifact
  onClose: () => void
}

export function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  const renderContent = () => {
    switch (artifact.type) {
      case "markdown":
        return (
          <div className="prose prose-sm max-w-none break-words overflow-hidden dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{artifact.content}</ReactMarkdown>
          </div>
        )
      case "python":
      case "json":
      case "sql":
      case "html":
        return <CodeViewer code={artifact.content} language={artifact.type} title={artifact.title} />
      default:
        return <div className="text-sm break-words overflow-hidden">{artifact.content}</div>
    }
  }

  return (
    <div className="flex h-screen flex-col border-l border-border bg-background">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold">{artifact.title}</h2>
          <p className="text-xs text-muted-foreground">{artifact.type.toUpperCase()}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
        <div className="max-w-full min-w-0 overflow-hidden p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
