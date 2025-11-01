"use client"

import { MessageSquare, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiModeToggleProps {
  mode: "chat" | "agent"
  onModeChange: (mode: "chat" | "agent") => void
}

export function AiModeToggle({ mode, onModeChange }: AiModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <Button
        variant={mode === "chat" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("chat")}
        className="h-7 gap-1.5 text-xs"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        Chat
      </Button>
      <Button
        variant={mode === "agent" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("agent")}
        className="h-7 gap-1.5 text-xs"
      >
        <Wand2 className="h-3.5 w-3.5" />
        Agent
      </Button>
    </div>
  )
}
