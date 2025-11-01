// File and folder structure types
export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  parentId?: string
}

// Editor tab types
export interface EditorTab {
  id: string
  fileId: string
  fileName: string
  content: string
  isActive: boolean
  isDirty: boolean
}

// Query result types
export interface QueryResult {
  id: string
  query: string
  columns: string[]
  rows: Record<string, any>[]
  executionTime: number
  timestamp: Date
  error?: string
}

// AI chat types
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type AIChatMode = "general" | "sql-edit"

export interface AIEditContext {
  fileId: string
  selectedText: string
  fullContent: string
  selectionRange?: {
    start: number
    end: number
  }
}

// Right panel types
export type RightPanelTab = "results" | "ai-assistant"

// Workspace type for managing multiple SQL workspaces
export interface Workspace {
  id: string
  name: string
  fileTree: FileNode[]
  openTabs: EditorTab[]
  activeTabId: string | null
  fileContent: Record<string, string>
}

// Artifact types for Claude-like interface
export interface Artifact {
  id: string
  type: "markdown" | "python" | "json" | "sql" | "html"
  title: string
  summary: string
  content: string
  language?: string
}

export interface ChatMessageWithArtifacts extends ChatMessage {
  artifacts?: Artifact[]
}
