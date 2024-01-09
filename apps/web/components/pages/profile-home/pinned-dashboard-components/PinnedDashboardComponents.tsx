import useProfile from "../../../../hooks/users/useProfile"
import { EUserPinnedComponents } from "custom-validator"
import ProductionTrackerBar from "../../../shared/graphs/ProductionTrackerBar"
import MachineProductionTracker from "../../../shared/graphs/MachineProductionTracker"
import MachineProductionPerLocationTracker from "../../../shared/graphs/MachineProductionPerLocationTracker"
import { Card } from "@mui/material"
import GridLayout from "react-grid-layout"
import PinOption from "../../../shared/Pin/PinOption"

const ComponentMap = {
  [EUserPinnedComponents.factoryOutlook]: ProductionTrackerBar,
  [EUserPinnedComponents.perMachine]: MachineProductionTracker,
  [EUserPinnedComponents.perMachinePerLocation]:
    MachineProductionPerLocationTracker,
} as const
const PinnedDashboardComponents = () => {
  const { data } = useProfile()
  const pinnedComponentsDashboard = data?.item?.pinnedComponentsDashboard
  return (
    <div className={"flex flex-col gap-4 pb-40"}>
      <GridLayout
        width={900}
        cols={2}
        rowHeight={400}
        draggableCancel=".non-draggable"
      >
        {pinnedComponentsDashboard?.map((pinnedType) => {
          const Component = ComponentMap[pinnedType]
          return (
            <Card className={"p-4 "} key={pinnedType}>
              <Component key={pinnedType} />
              <div className={"absolute right-0 top-0"}>
                <PinOption pinnedComponentType={pinnedType} />
              </div>
            </Card>
          )
        })}
      </GridLayout>
    </div>
  )
}

export default PinnedDashboardComponents
