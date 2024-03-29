import { T_MachineClass, T_Timer } from "custom-validator"
import TimerCards from "./TimerCards"
import { useEffect, useState } from "react"
import useTimersByLocation from "../../../../hooks/timers/useTimersByLocation"
import TimerSectionLoading from "./TimerSectionLoading"

type T_TimerByMachineClass = {
  id: string
  name: string
  count: number
  rowNumber: number
  timers: T_Timer[]
  isSelected: boolean
  machineClasses: T_MachineClass[]
}

const Timers = ({
  locationName,
  locationId,
  machineClasses,
}: {
  locationName: string
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

    const hasRadialPress = machineClasses.some(
      (machineClass) => machineClass.name === "Radial Press"
    )

    if (hasRadialPress) {
      const machineClassesVariantRemoved = machineClasses.filter(
        (machineClass) => machineClass.name !== "Variant"
      )
      const machineClassesVariant = machineClasses.find(
        (machineClass) => machineClass.name === "Variant"
      )
      const variantTimers =
        timersByLocation?.items?.filter((timer: T_Timer) => {
          if (timer.machineClassId === machineClassesVariant?._id) {
            return timer
          }
        }) || []
      const machineClassGroup = machineClassesVariantRemoved
        ?.map((machineClass) => {
          const timerByMachineClass =
            timersByLocation?.items?.filter((timer: T_Timer) => {
              if (timer.machineClassId === machineClass._id) {
                return timer
              }
            }) || []
          const isRadialPress = machineClass.name === "Radial Press"
          return {
            id: machineClass._id,
            name: isRadialPress
              ? `${machineClass.name} and Variants`
              : machineClass.name,
            count: isRadialPress
              ? timerByMachineClass.length + variantTimers.length
              : timerByMachineClass.length,
            rowNumber: machineClass.rowNumber,
            timers: isRadialPress
              ? [...timerByMachineClass, ...variantTimers]
              : timerByMachineClass,
            isSelected: machineClass.isSelected,
            machineClasses: isRadialPress
              ? [machineClass, machineClassesVariant]
              : [machineClass],
          }
        })
        .sort(function (a, b) {
          return a.rowNumber - b.rowNumber
        })
      setTimersByMachineClass(machineClassGroup as T_TimerByMachineClass[])
    } else {
      const machineClassGroup = machineClasses
        ?.map((machineClass) => {
          const timerByMachineClass =
            timersByLocation?.items?.filter((timer: T_Timer) => {
              if (timer.machineClassId === machineClass._id) {
                return timer
              }
            }) || []
          return {
            id: machineClass._id ?? "",
            name: machineClass.name,
            count: timerByMachineClass.length,
            rowNumber: machineClass.rowNumber,
            timers: timerByMachineClass,
            isSelected: machineClass.isSelected,
            machineClasses: [machineClass],
          }
        })
        .sort(function (a, b) {
          return a.rowNumber - b.rowNumber
        })
      setTimersByMachineClass(machineClassGroup)
    }
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
              <div key={timerByMachineClass.id}>
                <TimerCards
                  timerByMachineClass={timerByMachineClass}
                  isLoading={isTimersByLocationLoading}
                  locationId={locationId}
                  locationName={locationName}
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
