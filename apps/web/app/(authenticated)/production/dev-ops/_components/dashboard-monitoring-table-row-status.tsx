import React from "react"

interface Props {
  status: string
}

const DashboardMonitoringTableRowStatus: React.FC<Props> = ({ status }) => {
  const statusClasses: { [key: string]: string } = {
    PENDING:
      " capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-[#ffc107]",
    COMPLETED:
      "capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-[#0cb785]",
    FAILED:
      "capitalize p-2 w-full bg-green-600 rounded-md text-center text-white bg-[#dc3545]",
  }
  return <div className={statusClasses[status]}>{status}</div>
}

export default DashboardMonitoringTableRowStatus
