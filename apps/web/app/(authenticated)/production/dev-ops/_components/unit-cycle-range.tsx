"use client"
import ms from "ms"
import useDevOpsTimers from "./_state"

const UnitCycleRange = () => {
  const endTimeRange = useDevOpsTimers((state) => state.endTimerRange)
  const unitCycleTime = useDevOpsTimers((state) => state.unitCycleTime)
  const setUnitCycleTime = useDevOpsTimers((state) => state.setUnitCycleTime)

  const convertMinToMs = (value: number) => ms(value * 60000)
  const convertMsToSec = (value: number) => ms(value * 1000)

  return (
    <div>
      <h2>Unit Cycle Range ( 5sec - {convertMinToMs(endTimeRange[0])}) </h2>
      <div className="flex items-center justify-center space-x-2">
        <div className="flex flex-col items-center justify-center">
          <input
            type="number"
            placeholder="Ms"
            defaultValue={unitCycleTime[0] * 60}
            min={5}
            max={endTimeRange[0] * 60 - 10}
            value={unitCycleTime[0] === 0 ? "" : unitCycleTime[0]}
            className="rounded-md shadow-md w-32"
            onChange={(e) =>
              setUnitCycleTime([+e.target.value, unitCycleTime[1]])
            }
          />
          <h2>{convertMsToSec(unitCycleTime[0])}</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            defaultValue={unitCycleTime[1] * 60}
            min={10}
            max={endTimeRange[0] * 60}
            value={unitCycleTime[1] === 0 ? "" : unitCycleTime[1]}
            type="number"
            placeholder="Ms"
            className="rounded-md shadow-md w-32"
            onChange={(e) =>
              setUnitCycleTime([unitCycleTime[0], +e.target.value])
            }
          />
          <h2>{convertMsToSec(unitCycleTime[1])}</h2>
        </div>
      </div>
    </div>
  )
}

export default UnitCycleRange
