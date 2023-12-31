"use client"
import { Slider } from "@mui/material"
import ms from "ms"
import useDevOpsTimers from "./_state"

const EndTimerRangeSlider = () => {
  const endTimeRange = useDevOpsTimers((state) => state.endTimerRange)
  const setEndTimeRange = useDevOpsTimers((state) => state.setEndTimerRange)

  return (
    <div>
      <h2>End Time Range ( 30sec - 3hrs) </h2>
      <Slider
        value={endTimeRange}
        onChange={(_, newValue) => setEndTimeRange(newValue as number[])}
        valueLabelDisplay="off"
        className="w-60"
        style={{ color: "#102136" }}
        min={30000}
        max={10800000}
      />
      <h2 className="text-sm">
        {ms(endTimeRange[0])} - {ms(endTimeRange[1])}
      </h2>
    </div>
  )
}

export default EndTimerRangeSlider
