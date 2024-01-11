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
import { T_Endpoint } from "../../../../_types"
import { Button } from "antd"
import ms from "ms"

interface Props {
  data: T_Endpoint
}

export type DashboardMonitoringData = {
  id: string
  request_endpoint: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  database_model: string[]
  quota: number
  no_of_request: number
  average_response: number
}

export const columns: ColumnDef<DashboardMonitoringData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) =>
          table.toggleAllPageRowsSelected(!!value.target.checked)
        }
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600"
      />
    ),
    cell: ({ row }) => (
      <input
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value.target.checked)}
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600"
      />
    ),
  },
  {
    accessorKey: "request_endpoint",
    header: "Request Endpoint",
    cell: ({ row }) => (
      <div className=" w-44 overflow-ellipsis truncate">
        {row.getValue("request_endpoint")}
      </div>
    ),
  },
  {
    accessorKey: "database_model",
    header: "Database Model",
    cell: ({ row }) => (
      <div className=" w-44 overflow-ellipsis truncate">
        {row.getValue("database_model")}
      </div>
    ),
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <DashboardMonitoringTableRowStatus
  //       status={row.original.status}
  //       key={row.original.id}
  //     />
  //   ),
  // },
  {
    accessorKey: "no_of_queries",
    header: "No of Queries",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("no_of_queries")}</div>
    ),
  },
  {
    accessorKey: "average_response",
    header: "Average Response Time",
    cell: ({ row }) => (
      <div className="capitalize">{ms(row.getValue("average_response"))}</div>
    ),
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

const DashboardMonitoringTable: React.FC<Props> = ({ data }) => {
  const memoizedData = React.useMemo(() => {
    const endpointStatsObj = data.endpointStats
    const resultArray = []

    for (const endpoint in endpointStatsObj) {
      if (endpointStatsObj[endpoint]) {
        const endpointInfo = {
          request_endpoint: endpoint,
          no_of_request: endpointStatsObj[endpoint].requestCount,
          average_response: endpointStatsObj[endpoint].averageResponseTime,
          // status: "PENDING",
          database_model: endpointStatsObj[endpoint].queries.join(", "),
          no_of_queries: endpointStatsObj[endpoint].queries.length,
        }
        resultArray.push(endpointInfo)
      }
    }

    return resultArray
  }, [data.endpointStats])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: memoizedData,
    // @ts-ignore
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th scope="col" className="p-4" key={header.id}>
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
                  <td className="px-4 py-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default DashboardMonitoringTable
