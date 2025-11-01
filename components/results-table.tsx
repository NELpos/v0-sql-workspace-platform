"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  executionTime?: number
  rowCount?: number
}

interface ResultsTableProps {
  result: QueryResult
}

export function ResultsTable({ result }: ResultsTableProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{result.rowCount || result.rows.length} rows</span>
          {result.executionTime && <span>{result.executionTime}ms</span>}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              {result.columns.map((column) => (
                <TableHead key={column} className="font-mono text-xs">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, index) => (
              <TableRow key={index}>
                {result.columns.map((column) => (
                  <TableCell key={column} className="font-mono text-xs">
                    {row[column] !== null && row[column] !== undefined ? (
                      String(row[column])
                    ) : (
                      <span className="text-muted-foreground">NULL</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
