"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { File, FileText, FileJson, FileCode, Database, X, Send, Paperclip } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { FileNode } from "@/components/file-tree"

interface FileMention {
  id: string
  name: string
  content: string
}

interface FileMentionInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSubmit: (message: string, files: FileMention[]) => void
  disabled?: boolean
  fileTree: FileNode[]
  fileContent: Record<string, string>
}

export function FileMentionInput({
  value: externalValue,
  onChange: externalOnChange,
  onKeyDown,
  onSubmit,
  disabled,
  fileTree,
  fileContent,
}: FileMentionInputProps) {
  const [internalValue, setInternalValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mentionedFiles, setMentionedFiles] = useState<FileMention[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getAllFiles = (nodes: FileNode[]): FileNode[] => {
    const files: FileNode[] = []
    const traverse = (node: FileNode) => {
      if (node.type === "file") {
        files.push(node)
      }
      if (node.children) {
        node.children.forEach(traverse)
      }
    }
    nodes.forEach(traverse)
    return files
  }

  const allFiles = getAllFiles(fileTree)

  const filteredFiles = allFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) && !mentionedFiles.some((mf) => mf.id === file.id),
  )

  useEffect(() => {
    const lastAtIndex = externalValue.lastIndexOf("@", cursorPosition)
    if (lastAtIndex !== -1 && lastAtIndex === cursorPosition - 1) {
      setShowSuggestions(true)
      setSearchQuery("")
    } else if (lastAtIndex !== -1 && cursorPosition > lastAtIndex) {
      const query = externalValue.substring(lastAtIndex + 1, cursorPosition)
      if (!query.includes(" ")) {
        setShowSuggestions(true)
        setSearchQuery(query)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }, [externalValue, cursorPosition])

  const handleFileSelect = (file: FileNode) => {
    const content = fileContent[file.id] || ""
    const newMention: FileMention = {
      id: file.id,
      name: file.name,
      content,
    }
    setMentionedFiles([...mentionedFiles, newMention])

    const lastAtIndex = externalValue.lastIndexOf("@", cursorPosition)
    const newValue = externalValue.substring(0, lastAtIndex) + externalValue.substring(cursorPosition)
    setInternalValue(newValue)
    externalOnChange(newValue)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  const handleRemoveFile = (fileId: string) => {
    setMentionedFiles(mentionedFiles.filter((f) => f.id !== fileId))
  }

  const handleSubmitWithFiles = () => {
    if (!internalValue.trim() || disabled) return
    onSubmit(internalValue, mentionedFiles)
    setInternalValue("")
    setMentionedFiles([])
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    externalOnChange(newValue)
    setCursorPosition(e.target.selectionStart)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitWithFiles()
    }
    onKeyDown(e)
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".sql")) return <Database className="h-3 w-3" />
    if (fileName.endsWith(".md")) return <FileText className="h-3 w-3" />
    if (fileName.endsWith(".json")) return <FileJson className="h-3 w-3" />
    if (fileName.endsWith(".py")) return <FileCode className="h-3 w-3" />
    return <File className="h-3 w-3" />
  }

  return (
    <div className="relative">
      {mentionedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {mentionedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs"
            >
              {getFileIcon(file.name)}
              <span className="font-medium">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="ml-1 rounded-sm hover:bg-background"
                type="button"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={internalValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
            placeholder="Ask about SQL queries... (Type @ to reference files)"
            className="min-h-[80px] resize-none pr-10"
            disabled={disabled}
          />

          <button
            type="button"
            className="absolute bottom-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Type @ to attach files"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          {showSuggestions && filteredFiles.length > 0 && (
            <div className="absolute bottom-full left-0 z-50 mb-2 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
              <div className="p-2">
                <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">Select a file to attach</div>
                {filteredFiles.slice(0, 10).map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleFileSelect(file)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                    type="button"
                  >
                    {getFileIcon(file.name)}
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmitWithFiles}
          size="icon"
          disabled={!internalValue.trim() || disabled}
          className="h-10 w-10 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to send,{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Shift + Enter</kbd> for new line
      </div>
    </div>
  )
}
