"use client"

import dayjs from "dayjs"
import React, { useEffect, useRef } from "react"
import useTimer from "../hooks/useTimer"
import useDevOpsTimers from "./_state"

interface Props {
  startAt: Date
  endAt: Date
  timerId: string
  unitCycleTime: number
  sessionName: string
}

const TimerCardClock: React.FC<Props> = ({
  endAt,
  startAt,
  timerId,
  unitCycleTime,
  sessionName,
}) => {
  const setSessionName = useDevOpsTimers((state) => state.setSessionName)
  const { formattedTime, isClockRunning, setIsClockRunning } = useTimer({
    startTime: startAt,
    endTime: endAt,
    resetInterval: unitCycleTime,
    timerId,
  })
  const ref = useRef<any>()

  useEffect(() => {
    ref.current = setInterval(() => {
      if (dayjs().isAfter(dayjs(startAt)) && dayjs().isBefore(dayjs(endAt)))
        setIsClockRunning(true)
      if (dayjs().isAfter(dayjs(endAt))) setIsClockRunning(false)
    }, 1000)

    return () => clearInterval(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isClockRunning ? (
    <div className="flex items-center justify-center">
      <h2
        className={`text-center font-bold text-5xl ${
          !isClockRunning ? "text-stone-400" : "text-stone-800"
        }`}
      >
        {formattedTime}
      </h2>
    </div>
  ) : (
    <h2 className="text-5xl font-bold text-stone-400">00:00:00</h2>
  )
}

export default TimerCardClock
