import { Card, Divider, IconButton } from "@mui/material"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import DashboardMonitoringChart from "./dashboard-monitoring-chart"
import DashboardMonitoringTable from "./dashboard-monitoring-table"

const DashboardMonitoring = () => {
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
        <DashboardMonitoringChart />
        <DashboardMonitoringTable />
      </div>
    </Card>
  )
}

export default DashboardMonitoring
