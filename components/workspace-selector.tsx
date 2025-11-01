"use client"

import { useState } from "react"
import { Plus, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WorkspaceSelectorProps {
  workspaces: Array<{ id: string; name: string }>
  currentWorkspaceId: string
  onWorkspaceChange: (workspaceId: string) => void
  onAddWorkspace: () => void
  onDeleteWorkspace: (workspaceId: string) => void
}

export function WorkspaceSelector({
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  onAddWorkspace,
  onDeleteWorkspace,
}: WorkspaceSelectorProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDeleteWorkspace(currentWorkspaceId)
    setShowDeleteDialog(false)
  }

  return (
    <div className="flex items-center gap-2">
      <FolderOpen className="h-4 w-4 text-muted-foreground" />
      <Select value={currentWorkspaceId} onValueChange={onWorkspaceChange}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-transparent"
        onClick={onAddWorkspace}
        title="Add new workspace"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-transparent"
        onClick={() => setShowDeleteDialog(true)}
        disabled={workspaces.length <= 1}
        title="Delete workspace"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workspace? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
