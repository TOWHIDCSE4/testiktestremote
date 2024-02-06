"use client"
import { Slider } from "@mui/material"
import ms from "ms"
import useDevOpsTimers from "./_state"

const SliderComponent = () => {
  const startTime = useDevOpsTimers((state) => state.startTime)
  const setStartTime = useDevOpsTimers((state) => state.setStartTime)

  return (
    <div>
      <h2>Start Time ( 0-1 min) </h2>
      <Slider
        onChange={(_: Event, newValue: number | number[]) =>
          setStartTime(newValue as number)
        }
        defaultValue={startTime}
        value={startTime}
        valueLabelDisplay="off"
        // step={5}
        marks={[
          { value: 0, label: "" },
          { value: 10000, label: "" },
          { value: 20000, label: "" },
          { value: 30000, label: "" },
          { value: 40000, label: "" },
          { value: 50000, label: "" },
        ]}
        min={0}
        max={60000}
        className="w-60"
        style={{ color: "#102136" }}
      />
      <h2>0s-{ms(startTime)}</h2>
    </div>
  )
}

export default SliderComponent
