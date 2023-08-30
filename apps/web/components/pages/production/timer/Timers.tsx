import { T_MachineClass, T_Timer } from "custom-validator"
import TimerCards from "./TimerCards"
import { useEffect, useState } from "react"
import useTimersByLocation from "../../../../hooks/timers/useTimersByLocation"
import TimerSectionLoading from "./TimerSectionLoading"

type T_TimerByMachineClass = {
  id: string
  name: string
  count: number
  timers: T_Timer[]
  isSelected: boolean
}

const Timers = ({
  locationId,
  machineClasses,
}: {
  locationId: string
  machineClasses: (T_MachineClass & { isSelected: boolean })[]
}) => {
  const [timersByMachineClass, setTimersByMachineClass] = useState<
    T_TimerByMachineClass[]
  >([])
  const {
    data: timersByLocation,
    isLoading: isTimersByLocationLoading,
    setLocationId,
  } = useTimersByLocation()

  useEffect(() => {
    if (locationId) {
      setLocationId(locationId)
    }
  }, [locationId])

  useEffect(() => {
    if (!timersByLocation) return
    const machineClassGroup = machineClasses
      ?.map((machineClass) => {
        const timerByMachineClass =
          timersByLocation?.items?.filter((timer: T_Timer) => {
            if (timer.machineClassId === machineClass._id) {
              return timer
            }
          }) || []
        return {
          id: machineClass._id,
          name: machineClass.name,
          count: timerByMachineClass.length,
          timers: timerByMachineClass,
          isSelected: machineClass.isSelected,
        }
      })
      .sort(function (a, b) {
        return b.count - a.count
      })
    setTimersByMachineClass(machineClassGroup as T_TimerByMachineClass[])
  }, [timersByLocation, machineClasses])

  return (
    <>
      {!isTimersByLocationLoading ? (
        timersByMachineClass?.map(
          (
            timerByMachineClass: T_TimerByMachineClass & {
              isSelected: boolean
            },
            index
          ) => {
            if (timerByMachineClass.isSelected === false) return null
            return (
              <div key={index}>
                <TimerCards
                  timerByMachineClass={timerByMachineClass}
                  isLoading={isTimersByLocationLoading}
                  locationId={locationId}
                />
              </div>
            )
          }
        )
      ) : (
        <TimerSectionLoading />
      )}
    </>
  )
}

export default Timers
