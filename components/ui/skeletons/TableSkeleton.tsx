import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"

/**
 * Table Skeleton
 * Loading state for data tables
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 5,
  showHeader = true,
  showActions = true 
}: { 
  rows?: number
  columns?: number
  showHeader?: boolean
  showActions?: boolean
}) {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" /> {/* Title */}
            <Skeleton className="h-10 w-32" /> {/* Add button */}
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 max-w-sm" /> {/* Search */}
            <Skeleton className="h-10 w-32" /> {/* Filter */}
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(columns)].map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
                {showActions && (
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(rows)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {[...Array(columns)].map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard Table Skeleton
 * Specific for dashboard tables with stats
 */
export function DashboardTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <TableSkeleton rows={rows} columns={5} />
    </div>
  )
}
