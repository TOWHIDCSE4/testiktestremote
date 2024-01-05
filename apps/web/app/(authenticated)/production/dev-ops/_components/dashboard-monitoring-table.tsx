"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"
import DashboardMonitoringTableRowDropDown from "./dashboard-moitoring-table-row-dropdown"
import DashboardMonitoringTableRowStatus from "./dashboard-monitoring-table-row-status"

const data: DashboardMonitoringData[] = [
  {
    id: "m5gr84i9",
    request_ip: 316,
    status: "COMPLETED",
    database_model: "DB Modal One",
    quota: 12,
    rating: 3,
    no_of_request: 12,
  },
  {
    id: "3u1reuv4",
    request_ip: 242,
    status: "FAILED",
    database_model: "DB Modal Two",
    quota: 12,
    rating: 3,
    no_of_request: 12,
  },
  {
    id: "derv1ws0",
    request_ip: 837,
    status: "PENDING",
    database_model: "DB Modal Three",
    quota: 12,
    rating: 3,
    no_of_request: 12,
  },
  {
    id: "5kma53ae",
    request_ip: 874,
    status: "COMPLETED",
    database_model: "DB Modal Three",
    quota: 12,
    rating: 3,
    no_of_request: 12,
  },
  {
    id: "bhqecj4p",
    request_ip: 721,
    status: "FAILED",
    database_model: "DB Modal Four",
    quota: 12,
    rating: 3,
    no_of_request: 12,
  },
]

export type DashboardMonitoringData = {
  id: string
  request_ip: number
  status: "PENDING" | "COMPLETED" | "FAILED"
  database_model: string
  quota: number
  no_of_request: number
  rating: number
}

export const columns: ColumnDef<DashboardMonitoringData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600"
      />
    ),
    cell: ({ row, table }) => (
      <input
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600"
      />
    ),
  },
  {
    accessorKey: "request_ip",
    header: "Request IP",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("request_ip")}</div>
    ),
  },
  {
    accessorKey: "database_model",
    header: "Database Model",
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("database_model")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <DashboardMonitoringTableRowStatus
        status={row.original.status}
        key={row.original.id}
      />
    ),
  },
  {
    accessorKey: "quota",
    header: "Quota",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "no_of_request",
    header: "No Of Requests",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DashboardMonitoringTableRowDropDown key={row.original.id} />
    ),
  },
]

const DashboardMonitoringTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th scope="col" className="p-4 text-center" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {row.getVisibleCells().map((cell) => (
                <td className="px-4 py-2 text-center" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="h-24 text-center">
              No results.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default DashboardMonitoringTable
