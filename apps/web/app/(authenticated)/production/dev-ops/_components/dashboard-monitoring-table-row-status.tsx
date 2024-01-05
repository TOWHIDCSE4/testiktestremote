"use client"
import React from "react"

interface Props {
  status: string
}

const DashboardMonitoringTableRowStatus: React.FC<Props> = ({ status }) => {
  console.log(status)
  const statusClasses: { [key: string]: string } = {
    PENDING:
      " capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-amber-400",
    COMPLETED:
      "capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-emerald-500",
    FAILED:
      "capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-red-500",
  }
  return <div className={statusClasses[status] + ""}>{status}</div>
}

export default DashboardMonitoringTableRowStatus
