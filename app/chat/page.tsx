"use client"

import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <MessageSquare className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">AI Chat</h1>
        <p className="max-w-md text-muted-foreground">
          Dedicated AI chat interface coming soon. This will provide a focused environment for AI conversations without
          the workspace context.
        </p>
      </div>
    </div>
  )
}
