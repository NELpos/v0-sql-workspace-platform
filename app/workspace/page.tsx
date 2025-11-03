"use client"

import { useState } from "react"
import { Briefcase, Sparkles, Table2, X, ChevronDown, ChevronUp } from "lucide-react"
import type { FileNode } from "@/components/file-tree"
import { EditorTabs, type EditorTab } from "@/components/editor-tabs"
import { SqlEditor } from "@/components/sql-editor"
import { MarkdownEditor } from "@/components/markdown-editor" // Import MarkdownEditor
import { JsonEditor } from "@/components/json-editor" // Import JsonEditor
import { PythonEditor } from "@/components/python-editor" // Import PythonEditor
import { QueryStatus } from "@/components/query-status"
import { ResultsTable } from "@/components/results-table"
import { AiAssistantPanel } from "@/components/ai-assistant-panel"
import { Button } from "@/components/ui/button"
import type { QueryResult } from "@/components/results-table"
import type { ChatMessage } from "@/components/ai-chat"
import { executeQuery } from "@/lib/query-executor"
import { ExplorerTabs } from "@/components/explorer-tabs"
import type { TableSchema } from "@/components/database-explorer"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { WorkspaceSelector } from "@/components/workspace-selector"
import type { Workspace } from "@/lib/types"

interface EditorPane {
  id: string
  tabs: EditorTab[]
  activeTabId: string
}

const initialWorkspaces: Workspace[] = [
  {
    id: "workspace-1",
    name: "Production Queries",
    fileTree: [
      {
        id: "queries",
        name: "queries",
        type: "folder",
        children: [
          { id: "query1", name: "customer_analysis.sql", type: "file" },
          { id: "query2", name: "sales_report.sql", type: "file" },
        ],
      },
      {
        id: "schemas",
        name: "schemas",
        type: "folder",
        children: [{ id: "schema1", name: "create_tables.sql", type: "file" }],
      },
      {
        id: "docs",
        name: "documentation",
        type: "folder",
        children: [
          { id: "readme", name: "README.md", type: "file" },
          { id: "changelog", name: "CHANGELOG.md", type: "file" },
          { id: "schema-doc", name: "schema-documentation.md", type: "file" },
        ],
      },
      {
        id: "config",
        name: "config",
        type: "folder",
        children: [
          { id: "db-config", name: "database-config.json", type: "file" },
          { id: "app-settings", name: "app-settings.json", type: "file" },
        ],
      },
      {
        id: "scripts",
        name: "scripts",
        type: "folder",
        children: [
          { id: "data-processor", name: "data_processor.py", type: "file" },
          { id: "db-migration", name: "db_migration.py", type: "file" },
        ],
      },
    ],
    openTabs: [
      {
        id: "query1",
        name: "customer_analysis.sql",
        content: "SELECT * FROM customers\nWHERE created_at > '2024-01-01'\nORDER BY created_at DESC;",
      },
    ],
    activeTabId: "query1",
    fileContent: {
      query1: "SELECT * FROM customers\nWHERE created_at > '2024-01-01'\nORDER BY created_at DESC;",
      query2:
        "SELECT \n  product_id,\n  SUM(quantity) as total_sold,\n  SUM(revenue) as total_revenue\nFROM sales\nGROUP BY product_id;",
      schema1: "CREATE TABLE customers (\n  id INT PRIMARY KEY,\n  name VARCHAR(255),\n  email VARCHAR(255)\n);",
      readme:
        "# SQL Workspace\n\nWelcome to your SQL Workspace!\n\n## Features\n\n- Multi-tab SQL editor\n- Database explorer\n- AI-powered SQL assistant\n- Markdown documentation support\n\n## Getting Started\n\n1. Open a SQL file from the Explorer\n2. Write your query\n3. Click Run to execute\n4. View results in the Results panel\n\n## Documentation\n\nCheck out the other markdown files for more information about schemas and changes.",
      changelog:
        "# Changelog\n\n## Version 1.0.0 (2024-01-15)\n\n### Added\n- Initial release\n- SQL editor with syntax highlighting\n- Database explorer\n- AI assistant integration\n- Markdown documentation support\n\n### Features\n- Multi-workspace support\n- Split view editing\n- Context menu operations\n- Real-time query execution",
      "schema-doc":
        "# Database Schema Documentation\n\n## Tables\n\n### customers\n\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INT | Primary key |\n| name | VARCHAR(255) | Customer name |\n| email | VARCHAR(255) | Customer email |\n| created_at | TIMESTAMP | Account creation date |\n\n### orders\n\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INT | Primary key |\n| customer_id | INT | Foreign key to customers |\n| total | DECIMAL | Order total amount |\n| order_date | TIMESTAMP | Order date |\n\n## Relationships\n\n- `orders.customer_id` → `customers.id` (Many-to-One)",
      "db-config": JSON.stringify(
        {
          host: "localhost",
          port: 5432,
          database: "production_db",
          user: "admin",
          ssl: true,
          pool: {
            min: 2,
            max: 10,
          },
        },
        null,
        2,
      ),
      "app-settings": JSON.stringify(
        {
          appName: "SQL Workspace",
          version: "1.0.0",
          features: {
            aiAssistant: true,
            splitView: true,
            darkMode: false,
          },
          editor: {
            fontSize: 14,
            tabSize: 2,
            lineNumbers: true,
          },
        },
        null,
        2,
      ),
      "data-processor": `"""
Data processing utilities for SQL Workspace.

This module provides functions for processing and transforming
database query results.
"""

import pandas as pd
from typing import List, Dict, Any


def process_query_results(results: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Convert query results to a pandas DataFrame.
    
    Args:
        results: List of dictionaries containing query results
        
    Returns:
        DataFrame with processed results
    """
    df = pd.DataFrame(results)
    return df


def export_to_csv(df: pd.DataFrame, filename: str) -> None:
    """
    Export DataFrame to CSV file.
    
    Args:
        df: DataFrame to export
        filename: Output filename
    """
    df.to_csv(filename, index=False)
    print(f"Data exported to {filename}")


if __name__ == "__main__":
    # Example usage
    sample_data = [
        {"id": 1, "name": "Alice", "value": 100},
        {"id": 2, "name": "Bob", "value": 200},
    ]
    df = process_query_results(sample_data)
    print(df)
`,
      "db-migration": `"""
Database migration script for SQL Workspace.

This script handles database schema migrations and data transformations.
"""

import psycopg2
from typing import Optional


class DatabaseMigration:
    """Handle database migrations."""
    
    def __init__(self, connection_string: str):
        """
        Initialize migration handler.
        
        Args:
            connection_string: PostgreSQL connection string
        """
        self.connection_string = connection_string
        self.conn: Optional[psycopg2.extensions.connection] = None
    
    def connect(self) -> None:
        """Establish database connection."""
        self.conn = psycopg2.connect(self.connection_string)
        print("Connected to database")
    
    def execute_migration(self, sql: str) -> None:
        """
        Execute migration SQL.
        
        Args:
            sql: SQL migration script
        """
        if not self.conn:
            raise RuntimeError("Not connected to database")
        
        with self.conn.cursor() as cur:
            cur.execute(sql)
            self.conn.commit()
        print("Migration executed successfully")
    
    def close(self) -> None:
        """Close database connection."""
        if self.conn:
            self.conn.close()
            print("Connection closed")


if __name__ == "__main__":
    # Example usage
    migration = DatabaseMigration("postgresql://localhost/mydb")
    migration.connect()
    # migration.execute_migration("ALTER TABLE users ADD COLUMN age INT;")
    migration.close()
`,
    },
  },
  {
    id: "workspace-2",
    name: "Development",
    fileTree: [
      {
        id: "dev-queries",
        name: "dev-queries",
        type: "folder",
        children: [
          { id: "dev1", name: "test_query.sql", type: "file" },
          { id: "dev2", name: "debug.sql", type: "file" },
        ],
      },
      { id: "scratch", name: "scratch.sql", type: "file" },
    ],
    openTabs: [
      {
        id: "dev1",
        name: "test_query.sql",
        content: "-- Development test query\nSELECT * FROM test_table LIMIT 10;",
      },
    ],
    activeTabId: "dev1",
    fileContent: {
      dev1: "-- Development test query\nSELECT * FROM test_table LIMIT 10;",
      dev2: "-- Debug query\nEXPLAIN ANALYZE SELECT * FROM large_table;",
      scratch: "-- Scratch space\n",
    },
  },
  {
    id: "workspace-3",
    name: "Analytics",
    fileTree: [
      {
        id: "reports",
        name: "reports",
        type: "folder",
        children: [
          { id: "report1", name: "monthly_report.sql", type: "file" },
          { id: "report2", name: "user_metrics.sql", type: "file" },
        ],
      },
    ],
    openTabs: [],
    activeTabId: null,
    fileContent: {
      report1:
        "-- Monthly sales report\nSELECT DATE_TRUNC('month', order_date) as month,\n  SUM(total) as revenue\nFROM orders\nGROUP BY month;",
      report2: "-- User engagement metrics\nSELECT user_id, COUNT(*) as actions\nFROM user_events\nGROUP BY user_id;",
    },
  },
]

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(initialWorkspaces[0].id)

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0]

  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(currentWorkspace.activeTabId || undefined)
  const [panes, setPanes] = useState<EditorPane[]>([
    {
      id: "pane-1",
      tabs: currentWorkspace.openTabs,
      activeTabId: currentWorkspace.activeTabId || "",
    },
  ])
  const [activePaneId, setActivePaneId] = useState("pane-1")
  const [fileTree, setFileTree] = useState<FileNode[]>(currentWorkspace.fileTree)
  const [fileContent, setFileContent] = useState<Record<string, string>>(currentWorkspace.fileContent)

  const [queryResult, setQueryResult] = useState<QueryResult | undefined>(undefined)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [queryStatus, setQueryStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [queryError, setQueryError] = useState<string | undefined>(undefined)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)
  const [clipboardItem, setClipboardItem] = useState<{ id: string; operation: "cut" | "copy"; node: FileNode } | null>(
    null,
  )
  const [newFileId, setNewFileId] = useState<string | null>(null)

  const { toast } = useToast()

  const saveCurrentWorkspace = () => {
    const firstPane = panes[0]
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === currentWorkspaceId
          ? {
              ...w,
              fileTree,
              openTabs: firstPane.tabs,
              activeTabId: firstPane.activeTabId,
              fileContent,
            }
          : w,
      ),
    )
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    saveCurrentWorkspace()

    const newWorkspace = workspaces.find((w) => w.id === workspaceId)
    if (newWorkspace) {
      setCurrentWorkspaceId(workspaceId)
      setFileTree([...newWorkspace.fileTree])
      setPanes([
        {
          id: "pane-1",
          tabs: [...newWorkspace.openTabs],
          activeTabId: newWorkspace.activeTabId || "",
        },
      ])
      setActivePaneId("pane-1")
      setFileContent({ ...newWorkspace.fileContent })
      setSelectedFileId(newWorkspace.activeTabId || undefined)
    }
  }

  const handleAddWorkspace = () => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name: `Workspace ${workspaces.length + 1}`,
      fileTree: [{ id: "untitled", name: "untitled.sql", type: "file" }],
      openTabs: [],
      activeTabId: null,
      fileContent: {
        untitled: "-- New workspace\n",
      },
    }
    setWorkspaces([...workspaces, newWorkspace])
    handleWorkspaceChange(newWorkspace.id)
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    if (workspaces.length <= 1) return

    const newWorkspaces = workspaces.filter((w) => w.id !== workspaceId)
    setWorkspaces(newWorkspaces)

    if (currentWorkspaceId === workspaceId) {
      handleWorkspaceChange(newWorkspaces[0].id)
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId)

    const activePane = panes.find((p) => p.id === activePaneId)
    if (!activePane) return

    const existingTab = activePane.tabs.find((tab) => tab.id === fileId)
    if (existingTab) {
      setPanes(panes.map((pane) => (pane.id === activePaneId ? { ...pane, activeTabId: fileId } : pane)))
    } else {
      const fileName = findFileName(fileId, fileTree)
      const newTab: EditorTab = {
        id: fileId,
        name: fileName || "untitled.sql",
        content: fileContent[fileId] || "-- New file\n",
      }
      setPanes(
        panes.map((pane) =>
          pane.id === activePaneId ? { ...pane, tabs: [...pane.tabs, newTab], activeTabId: fileId } : pane,
        ),
      )
    }
  }

  const findFileName = (id: string, nodes: FileNode[]): string | null => {
    for (const node of nodes) {
      if (node.id === id) return node.name
      if (node.children) {
        const found = findFileName(id, node.children)
        if (found) return found
      }
    }
    return null
  }

  const handleTabClose = (paneId: string, tabId: string) => {
    setPanes((prevPanes) => {
      const updatedPanes = prevPanes.map((pane) => {
        if (pane.id !== paneId) return pane

        const newTabs = pane.tabs.filter((tab) => tab.id !== tabId)
        let newActiveTabId = pane.activeTabId

        // If closing the active tab, switch to the first remaining tab
        if (pane.activeTabId === tabId && newTabs.length > 0) {
          newActiveTabId = newTabs[0].id
        }

        return { ...pane, tabs: newTabs, activeTabId: newActiveTabId }
      })

      // Auto-close empty panes (except if it's the only pane)
      const nonEmptyPanes = updatedPanes.filter((pane) => pane.tabs.length > 0)

      // If all panes are empty, keep at least one pane
      if (nonEmptyPanes.length === 0) {
        return [{ id: "pane-1", tabs: [], activeTabId: "" }]
      }

      // If we removed the active pane, switch to the first remaining pane
      if (!nonEmptyPanes.find((p) => p.id === activePaneId)) {
        setActivePaneId(nonEmptyPanes[0].id)
      }

      return nonEmptyPanes
    })
  }

  const handleEditorChange = (paneId: string, value: string) => {
    setPanes(
      panes.map((pane) => {
        if (pane.id !== paneId) return pane

        return {
          ...pane,
          tabs: pane.tabs.map((tab) => (tab.id === pane.activeTabId ? { ...tab, content: value, isDirty: true } : tab)),
        }
      }),
    )

    const activePane = panes.find((p) => p.id === paneId)
    if (activePane) {
      setFileContent((prev) => ({ ...prev, [activePane.activeTabId]: value }))
    }
  }

  const handleRunQuery = async (paneId: string) => {
    const pane = panes.find((p) => p.id === paneId)
    if (!pane) return

    const activeTab = pane.tabs.find((tab) => tab.id === pane.activeTabId)
    if (!activeTab) return

    setQueryStatus("loading")
    setQueryError(undefined)
    setQueryResult(undefined)

    const result = await executeQuery(activeTab.content)

    if (result.success && result.result) {
      setQueryStatus("success")
      setQueryResult(result.result)
    } else {
      setQueryStatus("error")
      setQueryError(result.error?.message || "Query execution failed")
    }

    setTimeout(() => {
      setQueryStatus("idle")
    }, 3000)
  }

  const handleSendMessage = async (message: string, files?: Array<{ id: string; name: string; content: string }>) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])
    setIsAiLoading(true)

    try {
      const activePane = panes.find((p) => p.id === activePaneId)
      const activeTab = activePane?.tabs.find((tab) => tab.id === activePane.activeTabId)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: activeTab?.content,
          files: files || [], // Include referenced files
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that request.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleAddFile = () => {
    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name: "untitled", // No extension - user will add it during rename
      type: "file",
    }
    setFileTree([...fileTree, newFile])
    setFileContent((prev) => ({ ...prev, [newFile.id]: "" })) // Empty content initially
    setNewFileId(newFile.id) // Trigger rename mode

    // Clear newFileId after a short delay to allow FileTree to process it
    setTimeout(() => setNewFileId(null), 100)
  }

  const handleAddFolder = () => {
    const newFolder: FileNode = {
      id: `folder-${Date.now()}`,
      name: "New Folder",
      type: "folder",
      children: [],
    }
    setFileTree([...fileTree, newFolder])
  }

  const handleRefresh = () => {
    const workspace = workspaces.find((w) => w.id === currentWorkspaceId)
    if (workspace) {
      setFileTree([...workspace.fileTree])
    }
  }

  const handleRename = (nodeId: string, newName: string) => {
    const renameNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, name: newName }
        }
        if (node.children) {
          return { ...node, children: renameNode(node.children) }
        }
        return node
      })
    }
    setFileTree(renameNode(fileTree))

    setPanes(
      panes.map((pane) => ({
        ...pane,
        tabs: pane.tabs.map((tab) => (tab.id === nodeId ? { ...tab, name: newName } : tab)),
      })),
    )

    const currentContent = fileContent[nodeId]
    if (!currentContent || currentContent.trim() === "") {
      let defaultContent = ""

      if (newName.endsWith(".sql")) {
        defaultContent = "-- Write your SQL query here\n"
      } else if (newName.endsWith(".md")) {
        defaultContent = "# New Document\n\nStart writing your markdown here...\n"
      } else if (newName.endsWith(".json")) {
        defaultContent = "{\n  \n}\n"
      } else if (newName.endsWith(".py")) {
        defaultContent =
          '"""Python script."""\n\n\ndef main():\n    """Main function."""\n    pass\n\n\nif __name__ == "__main__":\n    main()\n'
      } else {
        defaultContent = "-- New file\n"
      }

      setFileContent((prev) => ({ ...prev, [nodeId]: defaultContent }))

      setPanes(
        panes.map((pane) => ({
          ...pane,
          tabs: pane.tabs.map((tab) => (tab.id === nodeId ? { ...tab, content: defaultContent } : tab)),
        })),
      )
    }
  }

  const handleDelete = (nodeId: string) => {
    const deleteNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.id === nodeId) return false
        if (node.children) {
          node.children = deleteNode(node.children)
        }
        return true
      })
    }
    setFileTree(deleteNode(fileTree))

    setPanes(
      panes.map((pane) => {
        const newTabs = pane.tabs.filter((tab) => tab.id !== nodeId)
        let newActiveTabId = pane.activeTabId

        if (pane.activeTabId === nodeId && newTabs.length > 0) {
          newActiveTabId = newTabs[0].id
        }

        return { ...pane, tabs: newTabs, activeTabId: newActiveTabId }
      }),
    )
  }

  const handleCut = (nodeId: string) => {
    const findNode = (nodes: FileNode[], id: string): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
          const found = findNode(node.children, id)
          if (found) return found
        }
      }
      return null
    }
    const node = findNode(fileTree, nodeId)
    if (node) {
      setClipboardItem({ id: nodeId, operation: "cut", node })
    }
  }

  const handleCopy = (nodeId: string) => {
    const findNode = (nodes: FileNode[], id: string): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
          const found = findNode(node.children, id)
          if (found) return found
        }
      }
      return null
    }
    const node = findNode(fileTree, nodeId)
    if (node) {
      setClipboardItem({ id: nodeId, operation: "copy", node })
    }
  }

  const handlePaste = (targetFolderId: string) => {
    if (!clipboardItem) return

    const cloneNode = (node: FileNode): FileNode => {
      return {
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        children: node.children?.map(cloneNode),
      }
    }

    if (clipboardItem.operation === "cut") {
      const deleteNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter((node) => {
          if (node.id === clipboardItem.id) return false
          if (node.children) {
            node.children = deleteNode(node.children)
          }
          return true
        })
      }

      const addToFolder = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === targetFolderId && node.type === "folder") {
            return {
              ...node,
              children: [...(node.children || []), clipboardItem.node],
            }
          }
          if (node.children) {
            return { ...node, children: addToFolder(node.children) }
          }
          return node
        })
      }

      setFileTree(addToFolder(deleteNode(fileTree)))
      setClipboardItem(null)
    } else if (clipboardItem.operation === "copy") {
      const copiedNode = cloneNode(clipboardItem.node)

      const addToFolder = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === targetFolderId && node.type === "folder") {
            return {
              ...node,
              children: [...(node.children || []), copiedNode],
            }
          }
          if (node.children) {
            return { ...node, children: addToFolder(node.children) }
          }
          return node
        })
      }

      setFileTree(addToFolder(fileTree))
    }
  }

  const handleAddFileToFolder = (folderId: string) => {
    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name: "untitled", // No extension - user will add it during rename
      type: "file",
    }

    const addToFolder = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === folderId && node.type === "folder") {
          return {
            ...node,
            children: [...(node.children || []), newFile],
          }
        }
        if (node.children) {
          return { ...node, children: addToFolder(node.children) }
        }
        return node
      })
    }

    setFileTree(addToFolder(fileTree))
    setFileContent((prev) => ({ ...prev, [newFile.id]: "" })) // Empty content initially
    setNewFileId(newFile.id) // Trigger rename mode

    // Clear newFileId after a short delay
    setTimeout(() => setNewFileId(null), 100)
  }

  const handleImportSchema = (tableName: string, schema: TableSchema) => {
    const createTableSQL = `CREATE TABLE ${tableName} (\n${schema.columns
      .map((col) => {
        const parts = [`  ${col.name} ${col.type}`]
        if (col.primaryKey) parts.push("PRIMARY KEY")
        if (!col.nullable) parts.push("NOT NULL")
        return parts.join(" ")
      })
      .join(",\n")}\n);`

    const activePane = panes.find((p) => p.id === activePaneId)
    if (!activePane) return

    const activeTab = activePane.tabs.find((tab) => tab.id === activePane.activeTabId)

    if (activeTab && activeTab.content.trim() && activeTab.content !== "-- Write your SQL query here\n") {
      toast({
        title: "기존 내용을 대체하시겠습니까?",
        description: "현재 에디터의 내용이 스키마로 교체됩니다.",
        action: (
          <ToastAction
            altText="대체"
            onClick={() => {
              setPanes(
                panes.map((pane) =>
                  pane.id === activePaneId
                    ? {
                        ...pane,
                        tabs: pane.tabs.map((tab) =>
                          tab.id === pane.activeTabId ? { ...tab, content: createTableSQL, isDirty: true } : tab,
                        ),
                      }
                    : pane,
                ),
              )
              setFileContent((prev) => ({ ...prev, [activePane.activeTabId]: createTableSQL }))
            }}
          >
            대체
          </ToastAction>
        ),
      })
    } else {
      if (activeTab) {
        setPanes(
          panes.map((pane) =>
            pane.id === activePaneId
              ? {
                  ...pane,
                  tabs: pane.tabs.map((tab) =>
                    tab.id === pane.activeTabId ? { ...tab, content: createTableSQL, isDirty: true } : tab,
                  ),
                }
              : pane,
          ),
        )
        setFileContent((prev) => ({ ...prev, [activePane.activeTabId]: createTableSQL }))
      } else {
        const newTab: EditorTab = {
          id: `schema-${Date.now()}`,
          name: `${tableName}_schema.sql`,
          content: createTableSQL,
        }
        setPanes(
          panes.map((pane) =>
            pane.id === activePaneId ? { ...pane, tabs: [...pane.tabs, newTab], activeTabId: newTab.id } : pane,
          ),
        )
        setFileContent((prev) => ({ ...prev, [newTab.id]: createTableSQL }))
      }
    }
  }

  const handleSplitView = () => {
    const activePane = panes.find((p) => p.id === activePaneId)
    if (!activePane) return

    const activeTab = activePane.tabs.find((tab) => tab.id === activePane.activeTabId)
    if (!activeTab) return

    const newPane: EditorPane = {
      id: `pane-${Date.now()}`,
      tabs: [{ ...activeTab }], // Only copy the active tab
      activeTabId: activeTab.id,
    }

    setPanes([...panes, newPane])
    setActivePaneId(newPane.id)
  }

  const handleClosePane = (paneId: string) => {
    if (panes.length <= 1) return

    const newPanes = panes.filter((p) => p.id !== paneId)
    setPanes(newPanes)

    if (activePaneId === paneId) {
      setActivePaneId(newPanes[0].id)
    }
  }

  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r border-border bg-card overflow-hidden">
          <ExplorerTabs
            fileTree={fileTree}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFileId}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            onRefresh={handleRefresh}
            onRename={handleRename}
            onDelete={handleDelete}
            onCut={handleCut}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onAddFileToFolder={handleAddFileToFolder}
            clipboardItem={clipboardItem ? { id: clipboardItem.id, operation: clipboardItem.operation } : null}
            onImportSchema={handleImportSchema}
            newFileId={newFileId}
          />
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <h1 className="text-sm font-semibold">Workspace</h1>
              <WorkspaceSelector
                workspaces={workspaces.map((w) => ({ id: w.id, name: w.name }))}
                currentWorkspaceId={currentWorkspaceId}
                onWorkspaceChange={handleWorkspaceChange}
                onAddWorkspace={handleAddWorkspace}
                onDeleteWorkspace={handleDeleteWorkspace}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                title={isAiPanelOpen ? "Hide AI Assistant" : "Show AI Assistant"}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">Snowflake</span>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </header>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {panes.map((pane, index) => {
              const activeTab = pane.tabs.find((tab) => tab.id === pane.activeTabId)
              const isActive = pane.id === activePaneId
              const isSqlFile = activeTab?.name.endsWith(".sql")
              const isMarkdownFile = activeTab?.name.endsWith(".md")
              const isJsonFile = activeTab?.name.endsWith(".json")
              const isPythonFile = activeTab?.name.endsWith(".py")

              return (
                <div
                  key={pane.id}
                  className={`flex min-w-0 flex-1 flex-col overflow-hidden ${
                    index > 0 ? "border-l border-border" : ""
                  } ${isActive ? "ring-1 ring-primary ring-inset" : ""}`}
                  onClick={() => setActivePaneId(pane.id)}
                >
                  <EditorTabs
                    tabs={pane.tabs}
                    activeTabId={pane.activeTabId}
                    onTabSelect={(tabId) => {
                      setActivePaneId(pane.id)
                      setPanes(panes.map((p) => (p.id === pane.id ? { ...p, activeTabId: tabId } : p)))
                    }}
                    onTabClose={(tabId) => handleTabClose(pane.id, tabId)}
                    onRunQuery={isSqlFile ? () => handleRunQuery(pane.id) : undefined}
                    onSplitView={panes.length < 3 ? handleSplitView : undefined}
                    showRunButton={isSqlFile}
                  />
                  {queryStatus !== "idle" && isActive && isSqlFile && (
                    <div className="border-b border-border p-2">
                      <QueryStatus status={queryStatus} error={queryError} executionTime={queryResult?.executionTime} />
                    </div>
                  )}
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    {activeTab ? (
                      isMarkdownFile ? (
                        <MarkdownEditor
                          value={activeTab.content}
                          onChange={(value) => handleEditorChange(pane.id, value)}
                        />
                      ) : isJsonFile ? (
                        <JsonEditor
                          value={activeTab.content}
                          onChange={(value) => handleEditorChange(pane.id, value)}
                        />
                      ) : isPythonFile ? (
                        <PythonEditor
                          value={activeTab.content}
                          onChange={(value) => handleEditorChange(pane.id, value)}
                        />
                      ) : (
                        <SqlEditor
                          value={activeTab.content}
                          onChange={(value) => handleEditorChange(pane.id, value)}
                          onRun={() => handleRunQuery(pane.id)}
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center p-4">
                        <p className="text-sm text-muted-foreground">No file open</p>
                      </div>
                    )}
                  </div>
                  {panes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClosePane(pane.id)
                      }}
                      className="absolute right-2 top-2 rounded-sm p-1 opacity-0 transition-opacity hover:bg-accent hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Panel - Query Results */}
          <div
            className={`flex flex-shrink-0 flex-col border-t border-border bg-card transition-all duration-200 ${
              isBottomPanelCollapsed ? "h-10" : "h-64"
            }`}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <div className="flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                <h2 className="text-sm font-semibold">Query Results</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBottomPanelCollapsed(!isBottomPanelCollapsed)}
                className="h-6 w-6 p-0"
              >
                {isBottomPanelCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {!isBottomPanelCollapsed && (
              <div className="flex-1 overflow-auto p-4">
                {queryResult ? (
                  <ResultsTable result={queryResult} />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No query results to display
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {isAiPanelOpen && (
          <AiAssistantPanel
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isAiLoading}
            onClose={() => setIsAiPanelOpen(false)}
            fileTree={fileTree}
            fileContent={fileContent}
            activeFileName={(() => {
              const activePane = panes.find((p) => p.id === activePaneId)
              const activeTab = activePane?.tabs.find((tab) => tab.id === activePane.activeTabId)
              return activeTab?.name
            })()}
            activeFileContent={(() => {
              const activePane = panes.find((p) => p.id === activePaneId)
              const activeTab = activePane?.tabs.find((tab) => tab.id === activePane.activeTabId)
              return activeTab?.content
            })()}
            onApplySuggestion={(content) => {
              const activePane = panes.find((p) => p.id === activePaneId)
              if (!activePane) return

              setPanes(
                panes.map((pane) =>
                  pane.id === activePaneId
                    ? {
                        ...pane,
                        tabs: pane.tabs.map((tab) =>
                          tab.id === pane.activeTabId ? { ...tab, content, isDirty: true } : tab,
                        ),
                      }
                    : pane,
                ),
              )

              setFileContent((prev) => ({ ...prev, [activePane.activeTabId]: content }))
            }}
          />
        )}
      </div>
    </div>
  )
}
