"use client"

import { useState, useMemo } from "react"
import { Check, Copy, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CodeViewerProps {
  code: string
  language: string
  title?: string
}

function highlightCode(code: string, language: string): string {
  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  switch (language.toLowerCase()) {
    case "python":
      // Keywords
      highlighted = highlighted.replace(
        /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|pass|break|continue|yield|lambda|async|await)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      // Strings
      highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1).)*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      // Functions
      highlighted = highlighted.replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
        '<span class="text-yellow-400">$1</span>',
      )
      break

    case "sql":
      // Keywords
      highlighted = highlighted.replace(
        /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|REFERENCES|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi,
        '<span class="text-blue-400">$1</span>',
      )
      // Strings
      highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1).)*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      // Comments
      highlighted = highlighted.replace(/(--.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      break

    case "json":
      // Property names
      highlighted = highlighted.replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      // String values
      highlighted = highlighted.replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
      // Numbers
      highlighted = highlighted.replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>')
      // Booleans and null
      highlighted = highlighted.replace(/\b(true|false|null)\b/g, '<span class="text-purple-400">$1</span>')
      break

    case "html":
      // Tags
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="text-blue-400">$1</span>')
      // Attributes
      highlighted = highlighted.replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-yellow-400">$1</span>=')
      // Attribute values
      highlighted = highlighted.replace(/=["']([^"']*)["']/g, '=<span class="text-green-400">"$1"</span>')
      // Closing bracket
      highlighted = highlighted.replace(/(&gt;)/g, '<span class="text-blue-400">$1</span>')
      break
  }

  return highlighted
}

export function CodeViewer({ code, language, title }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split("\n")
  const processedLines = useMemo(() => {
    return lines.map((line, index) => {
      let processedLine = highlightCode(line, language)

      // Highlight search term
      if (searchTerm) {
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        processedLine = processedLine.replace(
          new RegExp(escapedTerm, "gi"),
          '<mark class="bg-yellow-400/30 text-yellow-200">$&</mark>',
        )
      }

      return {
        number: index + 1,
        content: processedLine,
      }
    })
  }, [code, language, searchTerm, lines])

  return (
    <div className="w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-[#1e1e1e]">
      {/* Header with controls */}
      <div className="flex items-center justify-between border-b border-border bg-[#252526] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{language}</span>
          <span className="text-gray-600">•</span>
          <span className="text-sm text-gray-400">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Copy button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search input */}
      {showSearch && (
        <div className="border-b border-border bg-[#252526] px-4 py-2">
          <Input
            type="text"
            placeholder="Search in code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 bg-[#1e1e1e] text-sm text-gray-200 border-gray-700 focus:border-blue-500"
          />
        </div>
      )}

      {/* Code content with line numbers */}
      <div className="w-full overflow-x-hidden overflow-y-auto">
        <div className="flex min-h-[200px] w-full">
          {/* Line numbers */}
          <div className="flex-shrink-0 select-none border-r border-border bg-[#1e1e1e] px-4 py-4 text-right">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-xs leading-6 text-gray-600">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code lines */}
          <div className="flex-1 min-w-0 overflow-x-hidden px-4 py-4 font-mono text-sm">
            {processedLines.map((line) => (
              <div
                key={line.number}
                className="leading-6 whitespace-pre-wrap break-all"
                dangerouslySetInnerHTML={{ __html: line.content }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
