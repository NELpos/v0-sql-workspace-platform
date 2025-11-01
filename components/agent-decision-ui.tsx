"use client"

import { Check, X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface AgentDecisionUIProps {
  suggestion: string
  originalContent: string
  onAccept: (content: string) => void
  onReject: () => void
  fileName?: string
}

export function AgentDecisionUI({ suggestion, originalContent, onAccept, onReject, fileName }: AgentDecisionUIProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(suggestion)

  const handleAccept = () => {
    onAccept(isEditing ? editedContent : suggestion)
  }

  return (
    <div className="flex h-full flex-col border-t border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div>
          <h3 className="text-sm font-semibold">AI Suggestion</h3>
          {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-7 gap-1.5 text-xs">
            <Edit className="h-3.5 w-3.5" />
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="h-64 w-full rounded-md border border-border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <pre className="rounded-md border border-border bg-background p-3 font-mono text-sm overflow-x-auto">
              {suggestion}
            </pre>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">Review the AI suggestion and choose an action</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReject} className="gap-1.5 bg-transparent">
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button variant="default" size="sm" onClick={handleAccept} className="gap-1.5">
            <Check className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
