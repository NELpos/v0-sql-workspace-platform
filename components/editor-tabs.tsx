"use client"

import { X, Play, Columns } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface EditorTab {
  id: string
  name: string
  content: string
  isDirty?: boolean
}

interface EditorTabsProps {
  tabs: EditorTab[]
  activeTabId: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onRunQuery?: () => void // Make optional since not all file types support running
  onSplitView?: () => void
  showRunButton?: boolean // Add prop to control Run button visibility
}

export function EditorTabs({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onRunQuery,
  onSplitView,
  showRunButton = true, // Default to true for backward compatibility
}: EditorTabsProps) {
  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-card">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-2 border-r border-border px-3 py-2 text-sm transition-colors hover:bg-accent",
              activeTabId === tab.id && "bg-background text-foreground",
              activeTabId !== tab.id && "text-muted-foreground",
            )}
          >
            <button onClick={() => onTabSelect(tab.id)} className="flex items-center gap-2">
              <span className="max-w-[120px] truncate">
                {tab.name}
                {tab.isDirty && "*"}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
              className="opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-shrink-0 items-center gap-1 px-2">
        {showRunButton && onRunQuery && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onRunQuery} size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run Query (Ctrl+Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {onSplitView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onSplitView} size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Columns className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Split Editor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
