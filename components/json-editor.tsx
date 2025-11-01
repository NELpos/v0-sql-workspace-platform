"use client"

import { useEffect, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { Button } from "@/components/ui/button"
import { FileJson } from "lucide-react"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
    } catch (error) {
      console.error("Invalid JSON:", error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2">
        <FileJson className="h-4 w-4 text-orange-500" />
        <span className="text-xs font-medium text-muted-foreground">JSON Editor</span>
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={handleFormat} className="h-7 text-xs">
            Format JSON
          </Button>
        </div>
      </div>
      <div ref={editorRef} className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[json()]}
          onChange={onChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  )
}
