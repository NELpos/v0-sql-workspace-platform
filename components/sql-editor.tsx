"use client"

import type React from "react"

import { useCallback } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onRun?: () => void
}

export function SqlEditor({ value, onChange, onRun }: SqlEditorProps) {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val)
    },
    [onChange],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        onRun?.()
      }
    },
    [onRun],
  )

  return (
    <div className="h-full w-full overflow-hidden" onKeyDown={handleKeyDown}>
      <CodeMirror
        value={value}
        height="100%"
        theme="light"
        extensions={[sql()]}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
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
        style={{
          fontSize: "14px",
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  )
}
