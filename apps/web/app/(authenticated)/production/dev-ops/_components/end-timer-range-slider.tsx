"use client"
import ms from "ms"
import useDevOpsTimers from "./_state"

const EndTimerRangeSlider = () => {
  const endTimeRange = useDevOpsTimers((state) => state.endTimerRange)
  const setEndTimeRange = useDevOpsTimers((state) => state.setEndTimerRange)

  const convertSecondsIntoMilliseconds = (value: number) => ms(value * 1000)

  return (
    <div>
      <h2>End Time Range ( 30sec - 3hrs) </h2>
      <div className="flex items-center justify-center space-x-2">
        <div className="flex flex-col items-center justify-center">
          <input
            type="number"
            placeholder="No of timers"
            defaultValue={endTimeRange[0]}
            value={endTimeRange[0]}
            className="rounded-md shadow-md w-32"
            onChange={(e) =>
              setEndTimeRange([+e.target.value, endTimeRange[1]])
            }
          />
          <h2>{convertSecondsIntoMilliseconds(endTimeRange[0])}</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            defaultValue={endTimeRange[1]}
            value={endTimeRange[1]}
            type="number"
            placeholder="No of timers"
            className="rounded-md shadow-md w-32"
            onChange={(e) =>
              setEndTimeRange([endTimeRange[0], +e.target.value])
            }
          />
          <h2>{convertSecondsIntoMilliseconds(endTimeRange[1])}</h2>
        </div>
      </div>
    </div>
  )
}

export default EndTimerRangeSlider
