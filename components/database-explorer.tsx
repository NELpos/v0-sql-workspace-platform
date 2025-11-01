"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Database, Table2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface DatabaseSchema {
  id: string
  name: string
  tables: TableSchema[]
}

export interface TableSchema {
  id: string
  name: string
  columns: ColumnSchema[]
}

export interface ColumnSchema {
  name: string
  type: string
  nullable: boolean
  primaryKey?: boolean
}

interface DatabaseExplorerProps {
  onImportSchema?: (tableName: string, schema: TableSchema) => void
  searchQuery?: string // Add searchQuery prop
}

const mockDatabases: DatabaseSchema[] = [
  {
    id: "prod",
    name: "production",
    tables: [
      {
        id: "customers",
        name: "customers",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
          { name: "name", type: "VARCHAR(255)", nullable: false },
          { name: "email", type: "VARCHAR(255)", nullable: false },
          { name: "created_at", type: "TIMESTAMP", nullable: false },
          { name: "updated_at", type: "TIMESTAMP", nullable: true },
        ],
      },
      {
        id: "orders",
        name: "orders",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
          { name: "customer_id", type: "INTEGER", nullable: false },
          { name: "total_amount", type: "DECIMAL(10,2)", nullable: false },
          { name: "status", type: "VARCHAR(50)", nullable: false },
          { name: "created_at", type: "TIMESTAMP", nullable: false },
        ],
      },
      {
        id: "products",
        name: "products",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
          { name: "name", type: "VARCHAR(255)", nullable: false },
          { name: "price", type: "DECIMAL(10,2)", nullable: false },
          { name: "stock", type: "INTEGER", nullable: false },
        ],
      },
    ],
  },
  {
    id: "staging",
    name: "staging",
    tables: [
      {
        id: "test_users",
        name: "test_users",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
          { name: "username", type: "VARCHAR(100)", nullable: false },
          { name: "email", type: "VARCHAR(255)", nullable: false },
        ],
      },
    ],
  },
  {
    id: "dev",
    name: "development",
    tables: [
      {
        id: "dev_logs",
        name: "dev_logs",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
          { name: "message", type: "TEXT", nullable: false },
          { name: "level", type: "VARCHAR(20)", nullable: false },
          { name: "timestamp", type: "TIMESTAMP", nullable: false },
        ],
      },
    ],
  },
]

export function DatabaseExplorer({ onImportSchema, searchQuery = "" }: DatabaseExplorerProps) {
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set(["prod"]))
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const toggleDatabase = (dbId: string) => {
    setExpandedDatabases((prev) => {
      const next = new Set(prev)
      if (next.has(dbId)) {
        next.delete(dbId)
      } else {
        next.add(dbId)
      }
      return next
    })
  }

  const toggleTable = (tableId: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev)
      if (next.has(tableId)) {
        next.delete(tableId)
      } else {
        next.add(tableId)
      }
      return next
    })
    setSelectedTable(tableId)
  }

  const handleImport = (table: TableSchema) => {
    onImportSchema?.(table.name, table)
  }

  const filterDatabases = (databases: DatabaseSchema[], query: string): DatabaseSchema[] => {
    if (!query.trim()) return databases

    const lowerQuery = query.toLowerCase()

    return databases
      .map((db) => {
        const dbMatches = db.name.toLowerCase().includes(lowerQuery)
        const filteredTables = db.tables.filter((table) => table.name.toLowerCase().includes(lowerQuery))

        if (dbMatches || filteredTables.length > 0) {
          return {
            ...db,
            tables: filteredTables.length > 0 ? filteredTables : db.tables,
          }
        }
        return null
      })
      .filter((db): db is DatabaseSchema => db !== null)
  }

  const filteredDatabases = filterDatabases(mockDatabases, searchQuery)

  useEffect(() => {
    if (searchQuery.trim()) {
      const dbIds = new Set(filterDatabases(mockDatabases, searchQuery).map((db) => db.id))
      setExpandedDatabases(dbIds)
    }
  }, [searchQuery])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground">Database Explorer</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-0.5">
            {filteredDatabases.length > 0 ? (
              filteredDatabases.map((database) => {
                const isExpanded = expandedDatabases.has(database.id)
                return (
                  <div key={database.id}>
                    <button
                      onClick={() => toggleDatabase(database.id)}
                      className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors hover:bg-accent"
                    >
                      <span className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </span>
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="truncate text-left font-medium">{database.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{database.tables.length}</span>
                    </button>

                    {isExpanded && (
                      <div className="ml-4">
                        {database.tables.map((table) => {
                          const isTableExpanded = expandedTables.has(table.id)
                          const isSelected = selectedTable === table.id
                          return (
                            <div key={table.id}>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleTable(table.id)}
                                  className={cn(
                                    "flex flex-1 items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors hover:bg-accent",
                                    isSelected && "bg-accent",
                                  )}
                                >
                                  <span className="flex-shrink-0">
                                    {isTableExpanded ? (
                                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                  </span>
                                  <Table2 className="h-4 w-4 text-green-500" />
                                  <span className="truncate text-left">{table.name}</span>
                                  <span className="ml-auto text-xs text-muted-foreground">{table.columns.length}</span>
                                </button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={() => handleImport(table)}
                                  title="Import schema"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {isTableExpanded && (
                                <div className="ml-8 space-y-0.5 py-1">
                                  {table.columns.map((column) => (
                                    <div
                                      key={column.name}
                                      className="flex items-center gap-2 rounded px-2 py-0.5 text-xs text-muted-foreground"
                                    >
                                      <span className="font-mono">{column.name}</span>
                                      <span className="text-[10px] text-muted-foreground/70">{column.type}</span>
                                      {column.primaryKey && (
                                        <span className="rounded bg-primary/10 px-1 text-[10px] text-primary">PK</span>
                                      )}
                                      {!column.nullable && (
                                        <span className="text-[10px] text-muted-foreground/70">NOT NULL</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">No databases found</div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
