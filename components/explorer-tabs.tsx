"use client"

import { useState } from "react"
import { FileTree, type FileNode } from "@/components/file-tree"
import { DatabaseExplorer, type TableSchema } from "@/components/database-explorer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCode, Database, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ExplorerTabsProps {
  // SQL Explorer props
  fileTree: FileNode[]
  onFileSelect: (fileId: string) => void
  selectedFileId?: string
  onAddFile?: () => void
  onAddFolder?: () => void
  onRefresh?: () => void
  onRename?: (nodeId: string, newName: string) => void
  onDelete?: (nodeId: string) => void
  onCut?: (nodeId: string) => void
  onCopy?: (nodeId: string) => void
  onPaste?: (targetId: string) => void
  onAddFileToFolder?: (folderId: string) => void
  clipboardItem?: { id: string; operation: "cut" | "copy" } | null
  newFileId?: string | null // Add newFileId prop to trigger rename mode
  // Database Explorer props
  onImportSchema?: (tableName: string, schema: TableSchema) => void
  onInjectSampleSQL?: () => void
}

export function ExplorerTabs({
  fileTree,
  onFileSelect,
  selectedFileId,
  onAddFile,
  onAddFolder,
  onRefresh,
  onRename,
  onDelete,
  onCut,
  onCopy,
  onPaste,
  onAddFileToFolder,
  clipboardItem,
  newFileId, // Receive newFileId prop
  onImportSchema,
}: ExplorerTabsProps) {
  const [activeTab, setActiveTab] = useState("sql")
  const [filesSearchQuery, setFilesSearchQuery] = useState("")
  const [databaseSearchQuery, setDatabaseSearchQuery] = useState("")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
      <TabsList className="w-full justify-start rounded-none border-b border-border bg-card px-2">
        <TabsTrigger value="sql" className="gap-2 data-[state=active]:bg-background">
          <FileCode className="h-4 w-4" />
          Files
        </TabsTrigger>
        <TabsTrigger value="database" className="gap-2 data-[state=active]:bg-background">
          <Database className="h-4 w-4" />
          Database
        </TabsTrigger>
      </TabsList>

      <div className="border-b border-border px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={activeTab === "sql" ? "Search files..." : "Search databases..."}
            value={activeTab === "sql" ? filesSearchQuery : databaseSearchQuery}
            onChange={(e) => {
              if (activeTab === "sql") {
                setFilesSearchQuery(e.target.value)
              } else {
                setDatabaseSearchQuery(e.target.value)
              }
            }}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      <TabsContent value="sql" className="m-0 flex-1 overflow-hidden">
        <FileTree
          nodes={fileTree}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
          onRefresh={onRefresh}
          onRename={onRename}
          onDelete={onDelete}
          onCut={onCut}
          onCopy={onCopy}
          onPaste={onPaste}
          onAddFileToFolder={onAddFileToFolder}
          clipboardItem={clipboardItem}
          newFileId={newFileId}
          searchQuery={filesSearchQuery} // Pass search query to FileTree
        />
      </TabsContent>

      <TabsContent value="database" className="m-0 flex-1 overflow-hidden">
        <DatabaseExplorer onImportSchema={onImportSchema} searchQuery={databaseSearchQuery} />{" "}
        {/* Pass search query to DatabaseExplorer */}
      </TabsContent>
    </Tabs>
  )
}
