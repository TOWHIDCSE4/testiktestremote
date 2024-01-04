import { Card } from "@mui/material"
import ProductionTrackerBar from "../../../shared/graphs/ProductionTrackerBar"
import MachineProductionTracker from "../../../shared/graphs/MachineProductionTracker"
import MachineProductionPerLocationTracker from "../../../shared/graphs/MachineProductionPerLocationTracker"
import PinOption from "../../../shared/Pin/PinOption"
import { EUserPinnedComponents } from "custom-validator/ZUser"

const Analytics = () => {
  return (
    <div className="pt-4 pb-40 flex flex-col gap-5">
      <Card className="p-4 relative">
        <ProductionTrackerBar />
        <div className="absolute top-2 right-2">
          <PinOption
            pinnedComponentType={EUserPinnedComponents.factoryOutlook}
          />
        </div>
      </Card>
      <Card className="p-4 relative">
        <MachineProductionTracker />
        <div className="absolute top-2 right-2">
          <PinOption pinnedComponentType={EUserPinnedComponents.perMachine} />
        </div>
      </Card>
      <Card className="p-4 relative">
        <MachineProductionPerLocationTracker />
        <div className="absolute top-2 right-2">
          <PinOption
            pinnedComponentType={EUserPinnedComponents.perMachinePerLocation}
          />
        </div>
      </Card>
    </div>
  )
}

export default Analytics
