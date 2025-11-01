"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  ChevronsDownUp,
  ChevronsUpDown,
  RefreshCw,
  Scissors,
  Copy,
  Trash2,
  Edit2,
  Clipboard,
  FileText,
  FileJson,
  FileCode,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContextMenu, type ContextMenuItem } from "@/components/context-menu"

export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

interface FileTreeProps {
  nodes: FileNode[]
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
  newFileId?: string | null
  searchQuery?: string // Add searchQuery prop
}

export function FileTree({
  nodes,
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
  newFileId,
  searchQuery = "", // Add searchQuery with default value
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>()
    const collectFolderIds = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "folder") {
          initialExpanded.add(node.id)
          if (node.children) {
            collectFolderIds(node.children)
          }
        }
      })
    }
    collectFolderIds(nodes)
    return initialExpanded
  })

  const [allCollapsed, setAllCollapsed] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)

  useEffect(() => {
    if (newFileId) {
      setRenamingId(newFileId)
    }
  }, [newFileId])

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCollapseExpandAll = () => {
    if (allCollapsed) {
      const allFolderIds = new Set<string>()
      const collectFolderIds = (nodes: FileNode[]) => {
        nodes.forEach((node) => {
          if (node.type === "folder") {
            allFolderIds.add(node.id)
            if (node.children) {
              collectFolderIds(node.children)
            }
          }
        })
      }
      collectFolderIds(nodes)
      setExpandedFolders(allFolderIds)
      setAllCollapsed(false)
    } else {
      setExpandedFolders(new Set())
      setAllCollapsed(true)
    }
  }

  const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query.trim()) return nodes

    const lowerQuery = query.toLowerCase()

    return nodes
      .map((node) => {
        if (node.type === "folder") {
          const filteredChildren = node.children ? filterNodes(node.children, query) : []
          const folderMatches = node.name.toLowerCase().includes(lowerQuery)

          if (folderMatches || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren.length > 0 ? filteredChildren : node.children,
            }
          }
          return null
        } else {
          return node.name.toLowerCase().includes(lowerQuery) ? node : null
        }
      })
      .filter((node): node is FileNode => node !== null)
  }

  const filteredNodes = filterNodes(nodes, searchQuery)

  useEffect(() => {
    if (searchQuery.trim()) {
      const allFolderIds = new Set<string>()
      const collectFolderIds = (nodes: FileNode[]) => {
        nodes.forEach((node) => {
          if (node.type === "folder") {
            allFolderIds.add(node.id)
            if (node.children) {
              collectFolderIds(node.children)
            }
          }
        })
      }
      collectFolderIds(filterNodes(nodes, searchQuery))
      setExpandedFolders(allFolderIds)
    }
  }, [searchQuery, nodes])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground">Explorer</h2>
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddFile}>
                  <FilePlus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New File</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddFolder}>
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Folder</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCollapseExpandAll}>
                  {allCollapsed ? (
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronsDownUp className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{allCollapsed ? "Expand All" : "Collapse All"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRefresh}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Explorer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-0.5">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                onFileSelect={onFileSelect}
                selectedFileId={selectedFileId}
                level={0}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onRename={onRename}
                onDelete={onDelete}
                onCut={onCut}
                onCopy={onCopy}
                onPaste={onPaste}
                onAddFileToFolder={onAddFileToFolder}
                clipboardItem={clipboardItem}
                renamingId={renamingId}
                setRenamingId={setRenamingId}
              />
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No files found</div>
          )}
        </div>
      </div>
    </div>
  )
}

interface FileTreeNodeProps {
  node: FileNode
  onFileSelect: (fileId: string) => void
  selectedFileId?: string
  level: number
  expandedFolders: Set<string>
  onToggleFolder: (folderId: string) => void
  onRename?: (nodeId: string, newName: string) => void
  onDelete?: (nodeId: string) => void
  onCut?: (nodeId: string) => void
  onCopy?: (nodeId: string) => void
  onPaste?: (targetId: string) => void
  onAddFileToFolder?: (folderId: string) => void
  clipboardItem?: { id: string; operation: "cut" | "copy" } | null
  renamingId: string | null
  setRenamingId: (id: string | null) => void
}

function FileTreeNode({
  node,
  onFileSelect,
  selectedFileId,
  level,
  expandedFolders,
  onToggleFolder,
  onRename,
  onDelete,
  onCut,
  onCopy,
  onPaste,
  onAddFileToFolder,
  clipboardItem,
  renamingId,
  setRenamingId,
}: FileTreeNodeProps) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFileId === node.id
  const isFolder = node.type === "folder"
  const isRenaming = renamingId === node.id
  const isCut = clipboardItem?.id === node.id && clipboardItem?.operation === "cut"

  const isSqlFile = node.name.endsWith(".sql")
  const isMarkdownFile = node.name.endsWith(".md")
  const isJsonFile = node.name.endsWith(".json")
  const isPythonFile = node.name.endsWith(".py")

  const [renameValue, setRenameValue] = useState(node.name)

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(node.id)
    } else {
      onFileSelect(node.id)
    }
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== node.name) {
      onRename?.(node.id, renameValue.trim())
    }
    setRenamingId(null)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit()
    } else if (e.key === "Escape") {
      setRenameValue(node.name)
      setRenamingId(null)
    }
  }

  const contextMenuItems: ContextMenuItem[] = [
    ...(isFolder
      ? [
          {
            label: "Add New File",
            icon: <FilePlus className="h-4 w-4" />,
            onClick: () => onAddFileToFolder?.(node.id),
          },
          { separator: true },
        ]
      : []),
    {
      label: "Rename",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: () => {
        setRenamingId(node.id)
        setRenameValue(node.name)
      },
    },
    { separator: true },
    {
      label: "Cut",
      icon: <Scissors className="h-4 w-4" />,
      onClick: () => onCut?.(node.id),
    },
    {
      label: "Copy",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => onCopy?.(node.id),
    },
    ...(isFolder && clipboardItem
      ? [
          {
            label: "Paste",
            icon: <Clipboard className="h-4 w-4" />,
            onClick: () => onPaste?.(node.id),
          },
        ]
      : []),
    { separator: true },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete?.(node.id),
    },
  ]

  return (
    <div>
      <ContextMenu items={contextMenuItems}>
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors hover:bg-accent",
            isSelected && "bg-accent text-accent-foreground",
            isCut && "opacity-50",
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isFolder && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </span>
          )}
          {!isFolder && <span className="w-3.5" />}
          <span className="flex-shrink-0">
            {isFolder ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )
            ) : isSqlFile ? (
              <Database className="h-4 w-4 text-blue-600" />
            ) : isMarkdownFile ? (
              <FileText className="h-4 w-4 text-purple-500" />
            ) : isJsonFile ? (
              <FileJson className="h-4 w-4 text-orange-500" />
            ) : isPythonFile ? (
              <FileCode className="h-4 w-4 text-green-500" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
          {isRenaming ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleRenameKeyDown}
              className="flex-1 truncate bg-background px-1 text-left outline-none ring-1 ring-primary"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-left">{node.name}</span>
          )}
        </button>
      </ContextMenu>
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onRename={onRename}
              onDelete={onDelete}
              onCut={onCut}
              onCopy={onCopy}
              onPaste={onPaste}
              onAddFileToFolder={onAddFileToFolder}
              clipboardItem={clipboardItem}
              renamingId={renamingId}
              setRenamingId={setRenamingId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
