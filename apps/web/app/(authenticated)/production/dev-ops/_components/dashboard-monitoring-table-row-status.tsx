"use client"
import React from "react"
import combineClasses from "../../../../../helpers/combineClasses"

interface Props {
  status: string
}

const DashboardMonitoringTableRowStatus: React.FC<Props> = ({ status }) => {
  return (
    <div
      className={combineClasses(
        "capitalize p-2 w-full bg-green-600 rounded-md text-center text-white",
        status === "PENDING" && "bg-amber-400",
        status === "COMPLETED" && "bg-emerald-400",
        status === "FAILED" && "bg-red-400"
      )}
    >
      {status}
    </div>
  )
}

export default DashboardMonitoringTableRowStatus
