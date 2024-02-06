"use client"
import React from "react"
import useDevOpsTimers from "./_state"

interface Props {
  timerId: string
  defaultUnit: number
}

const TimerUnitsCounter: React.FC<Props> = ({ timerId, defaultUnit }) => {
  const timers = useDevOpsTimers((state) => state.dailyUnits)
  const timerUnits = timers.find((timer) => timer.timerId === timerId)
  const currentUnits = timerUnits?.unit
  return (
    <div>
      <h2
        className={`text-center font-bold text-5xl ${
          !currentUnits ? "text-stone-400" : "text-stone-800"
        }`}
      >
        {String(
          Number(currentUnits) > defaultUnit ? currentUnits : defaultUnit ?? 0
        ).padStart(3, "0")}
      </h2>
      <h6 className="text-lg font-semibold text-gray-700 uppercase">
        Daily Units
      </h6>
    </div>
  )
}

export default TimerUnitsCounter
