import { T_MachineClass } from "custom-validator"
import TimerCards from "./TimerCards"

const Timers = ({
  locationId,
  machineClasses,
}: {
  locationId: string
  machineClasses: (T_MachineClass & { isSelected: boolean })[]
}) => {
  return (
    <>
      {machineClasses?.map(
        (machineClass: T_MachineClass & { isSelected: boolean }) => {
          if (machineClass.isSelected === false) return null
          return (
            <div key={machineClass._id as string}>
              <TimerCards machineClass={machineClass} locationId={locationId} />
            </div>
          )
        }
      )}
    </>
  )
}

export default Timers
