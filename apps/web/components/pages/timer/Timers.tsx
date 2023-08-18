import { T_MachineClass } from "custom-validator"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import TimerCards from "./TimerCards"

const Timers = () => {
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()

  return (
    <>
      {machineClasses?.items.map((machineClass: T_MachineClass) => {
        return (
          <div key={machineClass._id as string}>
            <TimerCards machineClass={machineClass} />
          </div>
        )
      })}
    </>
  )
}

export default Timers
