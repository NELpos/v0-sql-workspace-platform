"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { AiChat, type ChatMessage } from "@/components/ai-chat"
import { Button } from "@/components/ui/button"
import { AiModeToggle } from "@/components/ai-mode-toggle"
import { AgentActions } from "@/components/agent-actions"
import { AgentDecisionUI } from "@/components/agent-decision-ui"
import type { FileNode } from "@/components/file-tree"

interface AiAssistantPanelProps {
  messages: ChatMessage[]
  onSendMessage: (message: string, files?: Array<{ id: string; name: string; content: string }>) => Promise<void>
  isLoading?: boolean
  onClose: () => void
  fileTree: FileNode[]
  fileContent: Record<string, string>
  activeFileName?: string
  activeFileContent?: string
  onApplySuggestion?: (content: string) => void
}

export function AiAssistantPanel({
  messages,
  onSendMessage,
  isLoading,
  onClose,
  fileTree,
  fileContent,
  activeFileName,
  activeFileContent,
  onApplySuggestion,
}: AiAssistantPanelProps) {
  const [mode, setMode] = useState<"chat" | "agent">("chat")
  const [agentSuggestion, setAgentSuggestion] = useState<string | null>(null)

  const getFileType = (): "sql" | "markdown" | "json" | "python" | "none" => {
    if (!activeFileName) return "none"
    if (activeFileName.endsWith(".sql")) return "sql"
    if (activeFileName.endsWith(".md")) return "markdown"
    if (activeFileName.endsWith(".json")) return "json"
    if (activeFileName.endsWith(".py")) return "python"
    return "none"
  }

  const handleAgentAction = async (actionId: string, prompt: string) => {
    const fullPrompt = `${prompt}\n\nCurrent file content:\n\`\`\`\n${activeFileContent || ""}\n\`\`\``

    try {
      console.log("[v0] Calling agent action:", actionId)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullPrompt,
          context: activeFileContent,
          mode: "agent",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.warning) {
        console.warn("[v0] AI service warning:", data.warning)
      }

      setAgentSuggestion(data.response || "No suggestion generated")
      console.log("[v0] Agent suggestion received")
    } catch (error: any) {
      console.error("[v0] Failed to get agent suggestion:", error)
      setAgentSuggestion(
        `// Error: Failed to generate suggestion\n// ${error.message}\n\n// Please try again or use Chat mode`,
      )
    }
  }

  const handleAcceptSuggestion = (content: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(content)
    }
    setAgentSuggestion(null)
  }

  const handleRejectSuggestion = () => {
    setAgentSuggestion(null)
  }

  return (
    <aside className="flex w-96 flex-shrink-0 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-sm font-semibold">AI Assistant</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="border-b border-border px-4 py-2">
        <AiModeToggle mode={mode} onModeChange={setMode} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === "chat" ? (
          <AiChat
            messages={messages}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            fileTree={fileTree}
            fileContent={fileContent}
          />
        ) : agentSuggestion ? (
          <AgentDecisionUI
            suggestion={agentSuggestion}
            originalContent={activeFileContent || ""}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
            fileName={activeFileName}
          />
        ) : (
          <AgentActions
            fileType={getFileType()}
            fileName={activeFileName}
            onAction={handleAgentAction}
            isLoading={isLoading}
          />
        )}
      </div>
    </aside>
  )
}
