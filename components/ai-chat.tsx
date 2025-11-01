"use client"

import { useEffect, useRef } from "react"
import { Sparkles, User } from "lucide-react"
import { FileMentionInput } from "@/components/file-mention-input"
import type { FileNode } from "@/components/file-tree"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface FileMention {
  id: string
  name: string
  content: string
}

interface AiChatProps {
  onSendMessage: (message: string, files?: FileMention[]) => Promise<void>
  messages: ChatMessage[]
  isLoading?: boolean
  fileTree: FileNode[]
  fileContent: Record<string, string>
}

export function AiChat({ onSendMessage, messages, isLoading, fileTree, fileContent }: AiChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (message: string, files: FileMention[]) => {
    if (!message.trim() || isLoading) return
    await onSendMessage(message, files)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold">AI SQL Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your SQL queries, code, or documentation
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}

              <div
                className={`flex max-w-[85%] flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </div>

                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline ? (
                              <pre className="overflow-x-auto rounded-md bg-muted p-3">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="rounded bg-muted px-1.5 py-0.5" {...props}>
                                {children}
                              </code>
                            )
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed">{message.content}</div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-medium text-muted-foreground">AI Assistant</div>
                <div className="rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="flex flex-col gap-3">
          <FileMentionInput
            value=""
            onChange={() => {}}
            onKeyDown={() => {}}
            onSubmit={handleSubmit}
            disabled={isLoading}
            fileTree={fileTree}
            fileContent={fileContent}
          />
        </div>
      </div>
    </div>
  )
}
