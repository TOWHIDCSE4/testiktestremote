import { Card } from "@mui/material"
import ProductionTrackerBar from "../../../shared/graphs/ProductionTrackerBar"
import MachineProductionTracker from "../../../shared/graphs/MachineProductionTracker"
import MachineProductionPerLocationTracker from "../../../shared/graphs/MachineProductionPerLocationTracker"

const Analytics = () => {
  return (
    <div className="pt-4 pb-40 flex flex-col gap-5">
      <Card className="p-4">
        <ProductionTrackerBar />
      </Card>
      <Card className="p-4">
        <MachineProductionTracker />
      </Card>
      <Card className="p-4">
        <MachineProductionPerLocationTracker />
      </Card>
    </div>
  )
}

export default Analytics
