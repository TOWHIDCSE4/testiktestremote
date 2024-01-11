import { Card, Divider, IconButton } from "@mui/material"
import { cookies } from "next/headers"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import { API_URL } from "../../../../../helpers/constants"
import { T_Endpoint } from "../../../../_types"
import DashboardMonitoringChart from "./dashboard-monitoring-chart"
import DashboardMonitoringTable from "./dashboard-monitoring-table"

const _Get_Request_Tracker_Endpoints = async () => {
  const cookiesStore = cookies()
  const token = cookiesStore.get("tfl")
  const res = await fetch(`${API_URL}/api/dev-ops/request-tracker`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    next: { tags: ["devOps-timers"] },
  })
  return (await res.json()) as T_Endpoint
}

const DashboardMonitoring = async () => {
  const endpoints = await _Get_Request_Tracker_Endpoints()
  return (
    <Card className="w-full flex-1">
      <div className="flex items-center justify-between space-x-2 p-2 z-50">
        <h2 className="font-semibold">Dashboard Monitoring</h2>
        <div className="flex items-center space-x-2">
          <IconButton>
            <BiRefresh />
          </IconButton>

          <IconButton>
            <LuMoreVertical />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col space-y-1 mt-2">
        <DashboardMonitoringChart data={endpoints} />
        <DashboardMonitoringTable data={endpoints} />
      </div>
    </Card>
  )
}

export default DashboardMonitoring
