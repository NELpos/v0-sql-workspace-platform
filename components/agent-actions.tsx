"use client"

import { Database, FileText, FileJson, FileCode, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentActionsProps {
  fileType: "sql" | "markdown" | "json" | "python" | "none"
  fileName?: string
  onAction: (action: string, prompt: string) => void
  isLoading?: boolean
}

const actionsByFileType = {
  sql: [
    { id: "write", label: "Write Query", prompt: "Write a SQL query for: " },
    { id: "optimize", label: "Optimize Query", prompt: "Optimize this SQL query for better performance" },
    { id: "explain", label: "Explain Query", prompt: "Explain what this SQL query does in detail" },
    { id: "add-comments", label: "Add Comments", prompt: "Add helpful comments to this SQL query" },
    { id: "fix-errors", label: "Fix Errors", prompt: "Find and fix any errors in this SQL query" },
  ],
  markdown: [
    { id: "write", label: "Write Documentation", prompt: "Write documentation for: " },
    { id: "improve", label: "Improve Content", prompt: "Improve the clarity and structure of this markdown content" },
    { id: "format", label: "Format Document", prompt: "Format this markdown document with proper structure" },
    { id: "add-examples", label: "Add Examples", prompt: "Add code examples to this documentation" },
  ],
  json: [
    { id: "format", label: "Format JSON", prompt: "Format and prettify this JSON" },
    { id: "validate", label: "Validate Schema", prompt: "Validate this JSON and suggest improvements" },
    { id: "add-fields", label: "Add Fields", prompt: "Suggest additional fields for this JSON structure" },
    { id: "convert", label: "Convert Format", prompt: "Convert this JSON to a different format" },
  ],
  python: [
    { id: "write", label: "Write Function", prompt: "Write a Python function for: " },
    { id: "add-docstrings", label: "Add Docstrings", prompt: "Add comprehensive docstrings to this Python code" },
    { id: "optimize", label: "Optimize Code", prompt: "Optimize this Python code for better performance" },
    { id: "add-tests", label: "Add Tests", prompt: "Write unit tests for this Python code" },
    { id: "fix-errors", label: "Fix Errors", prompt: "Find and fix any errors in this Python code" },
  ],
  none: [{ id: "help", label: "Get Help", prompt: "How can I help you with your workspace?" }],
}

const fileTypeIcons = {
  sql: Database,
  markdown: FileText,
  json: FileJson,
  python: FileCode,
  none: Sparkles,
}

export function AgentActions({ fileType, fileName, onAction, isLoading }: AgentActionsProps) {
  const actions = actionsByFileType[fileType] || actionsByFileType.none
  const Icon = fileTypeIcons[fileType]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Agent Actions</h3>
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {fileType === "none"
            ? "Open a file to see context-specific actions"
            : "Select an action to apply to your file"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid gap-2 p-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto justify-start gap-2 p-3 text-left bg-transparent"
              onClick={() => onAction(action.id, action.prompt)}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.prompt}</div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
