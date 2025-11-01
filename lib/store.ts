import { create } from "zustand"
import type { FileNode, EditorTab, QueryResult, ChatMessage, AIChatMode, AIEditContext, RightPanelTab } from "./types"

interface WorkspaceState {
  // File tree state
  files: FileNode[]
  selectedFileId: string | null

  // Editor tabs state
  editorTabs: EditorTab[]
  activeTabId: string | null

  // Query results state
  queryResults: QueryResult[]
  activeResultId: string | null

  // AI chat state
  chatMessages: ChatMessage[]
  aiChatMode: AIChatMode
  aiEditContext: AIEditContext | null

  // Right panel state
  rightPanelTab: RightPanelTab
  isRightPanelOpen: boolean

  // Actions - File tree
  addFile: (parentId: string | null, name: string) => void
  addFolder: (parentId: string | null, name: string) => void
  deleteFile: (fileId: string) => void
  renameFile: (fileId: string, newName: string) => void
  selectFile: (fileId: string) => void
  updateFileContent: (fileId: string, content: string) => void

  // Actions - Editor tabs
  openTab: (file: FileNode) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  updateTabContent: (tabId: string, content: string) => void

  // Actions - Query results
  addQueryResult: (result: QueryResult) => void
  clearQueryResults: () => void

  // Actions - AI chat
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void
  setAIChatMode: (mode: AIChatMode) => void
  setAIEditContext: (context: AIEditContext | null) => void

  // Actions - Right panel
  setRightPanelTab: (tab: RightPanelTab) => void
  toggleRightPanel: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Initial state
  files: [
    {
      id: "folder-1",
      name: "queries",
      type: "folder",
      children: [
        {
          id: "file-1",
          name: "sample-query.sql",
          type: "file",
          content:
            "-- Sample SQL Query\nSELECT * FROM users\nWHERE created_at > CURRENT_DATE - INTERVAL '7 days'\nORDER BY created_at DESC\nLIMIT 100;",
          parentId: "folder-1",
        },
        {
          id: "file-2",
          name: "analytics.sql",
          type: "file",
          content:
            "-- Analytics Query\nSELECT \n  DATE_TRUNC('day', created_at) as date,\n  COUNT(*) as user_count,\n  COUNT(DISTINCT email) as unique_emails\nFROM users\nGROUP BY DATE_TRUNC('day', created_at)\nORDER BY date DESC;",
          parentId: "folder-1",
        },
      ],
    },
    {
      id: "file-3",
      name: "untitled.sql",
      type: "file",
      content: "-- New Query\n",
      parentId: null,
    },
  ],
  selectedFileId: null,
  editorTabs: [],
  activeTabId: null,
  queryResults: [],
  activeResultId: null,
  chatMessages: [],
  aiChatMode: "general",
  aiEditContext: null,
  rightPanelTab: "results",
  isRightPanelOpen: true,

  // File tree actions
  addFile: (parentId, name) => {
    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name,
      type: "file",
      content: "-- New SQL File\n",
      parentId,
    }

    set((state) => {
      if (!parentId) {
        return { files: [...state.files, newFile] }
      }

      const updateChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId && node.type === "folder") {
            return {
              ...node,
              children: [...(node.children || []), newFile],
            }
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) }
          }
          return node
        })
      }

      return { files: updateChildren(state.files) }
    })
  },

  addFolder: (parentId, name) => {
    const newFolder: FileNode = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      children: [],
      parentId,
    }

    set((state) => {
      if (!parentId) {
        return { files: [...state.files, newFolder] }
      }

      const updateChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId && node.type === "folder") {
            return {
              ...node,
              children: [...(node.children || []), newFolder],
            }
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) }
          }
          return node
        })
      }

      return { files: updateChildren(state.files) }
    })
  },

  deleteFile: (fileId) => {
    set((state) => {
      const removeNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter((node) => {
          if (node.id === fileId) return false
          if (node.children) {
            node.children = removeNode(node.children)
          }
          return true
        })
      }

      return {
        files: removeNode(state.files),
        editorTabs: state.editorTabs.filter((tab) => tab.fileId !== fileId),
      }
    })
  },

  renameFile: (fileId, newName) => {
    set((state) => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === fileId) {
            return { ...node, name: newName }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }

      return { files: updateNode(state.files) }
    })
  },

  selectFile: (fileId) => {
    set({ selectedFileId: fileId })
  },

  updateFileContent: (fileId, content) => {
    set((state) => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === fileId) {
            return { ...node, content }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }

      return { files: updateNode(state.files) }
    })
  },

  // Editor tab actions
  openTab: (file) => {
    const state = get()
    const existingTab = state.editorTabs.find((tab) => tab.fileId === file.id)

    if (existingTab) {
      set({
        activeTabId: existingTab.id,
        editorTabs: state.editorTabs.map((tab) => ({
          ...tab,
          isActive: tab.id === existingTab.id,
        })),
      })
    } else {
      const newTab: EditorTab = {
        id: `tab-${Date.now()}`,
        fileId: file.id,
        fileName: file.name,
        content: file.content || "",
        isActive: true,
        isDirty: false,
      }

      set({
        editorTabs: [...state.editorTabs.map((tab) => ({ ...tab, isActive: false })), newTab],
        activeTabId: newTab.id,
      })
    }
  },

  closeTab: (tabId) => {
    set((state) => {
      const tabs = state.editorTabs.filter((tab) => tab.id !== tabId)
      const wasActive = state.activeTabId === tabId

      if (wasActive && tabs.length > 0) {
        const newActiveTab = tabs[tabs.length - 1]
        return {
          editorTabs: tabs.map((tab) => ({
            ...tab,
            isActive: tab.id === newActiveTab.id,
          })),
          activeTabId: newActiveTab.id,
        }
      }

      return {
        editorTabs: tabs,
        activeTabId: tabs.length > 0 ? state.activeTabId : null,
      }
    })
  },

  setActiveTab: (tabId) => {
    set((state) => ({
      activeTabId: tabId,
      editorTabs: state.editorTabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      })),
    }))
  },

  updateTabContent: (tabId, content) => {
    set((state) => ({
      editorTabs: state.editorTabs.map((tab) => (tab.id === tabId ? { ...tab, content, isDirty: true } : tab)),
    }))
  },

  // Query result actions
  addQueryResult: (result) => {
    set((state) => ({
      queryResults: [result, ...state.queryResults],
      activeResultId: result.id,
      rightPanelTab: "results",
      isRightPanelOpen: true,
    }))
  },

  clearQueryResults: () => {
    set({ queryResults: [], activeResultId: null })
  },

  // AI chat actions
  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }))
  },

  clearChatMessages: () => {
    set({ chatMessages: [] })
  },

  setAIChatMode: (mode) => {
    set({ aiChatMode: mode })
  },

  setAIEditContext: (context) => {
    set({ aiEditContext: context })
  },

  // Right panel actions
  setRightPanelTab: (tab) => {
    set({ rightPanelTab: tab, isRightPanelOpen: true })
  },

  toggleRightPanel: () => {
    set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen }))
  },
}))
