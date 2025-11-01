"use client"

import { useState } from "react"
import { Table2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResultsTable, type QueryResult } from "@/components/results-table"
import { AiChat, type ChatMessage } from "@/components/ai-chat"

type PanelTab = "results" | "ai"

interface ResultsPanelProps {
  queryResult?: QueryResult
  chatMessages: ChatMessage[]
  onSendMessage: (message: string) => Promise<void>
  isAiLoading?: boolean
}

export function ResultsPanel({ queryResult, chatMessages, onSendMessage, isAiLoading }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("results")

  return (
    <div className="flex h-full flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("results")}
          className={cn(
            "flex items-center gap-2 border-r border-border px-4 py-2 text-sm transition-colors",
            activeTab === "results" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent",
          )}
        >
          <Table2 className="h-4 w-4" />
          Results
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
            activeTab === "ai" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent",
          )}
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "results" && (
          <div className="h-full">
            {queryResult ? (
              <ResultsTable result={queryResult} />
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-sm text-muted-foreground">Run a query to see results</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "ai" && (
          <div className="h-full">
            <AiChat messages={chatMessages} onSendMessage={onSendMessage} isLoading={isAiLoading} />
          </div>
        )}
      </div>
    </div>
  )
}
