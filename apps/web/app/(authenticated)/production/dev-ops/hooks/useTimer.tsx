import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { useEffect, useState } from "react"

const useTimer = ({
  startTime,
  endTime,
}: {
  startTime: Date
  endTime: Date
}) => {
  dayjs.extend(duration)
  const [formattedTime, setFormattedTime] = useState("00:00:00")
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [milliseconds, setMilliseconds] = useState(0)

  useEffect(() => {
    const startAtTime = dayjs(startTime)
    const endAtTime = dayjs(endTime)

    const updateTimer = () => {
      const currentTime = dayjs()
      let duration

      if (currentTime.isBefore(startAtTime)) {
        duration = dayjs.duration(startAtTime.diff(currentTime))
        setIsClockRunning(false)
      } else if (currentTime.isAfter(endAtTime)) {
        clearInterval(timerInterval)
        setFormattedTime("00:00:00")
        setIsClockRunning(false)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
        setMilliseconds(0)
        return
      } else {
        duration = dayjs.duration(currentTime.diff(startAtTime))
        setIsClockRunning(true)
      }

      setHours(duration.hours())
      setMinutes(duration.minutes())
      setSeconds(duration.seconds())
      setMilliseconds(duration.milliseconds())

      const formattedTimeString = `${String(duration.hours()).padStart(
        2,
        "0"
      )}:${String(duration.minutes()).padStart(2, "0")}:${String(
        duration.seconds()
      ).padStart(2, "0")}`
      setFormattedTime(formattedTimeString)
    }

    const timerInterval = setInterval(updateTimer, 1000)

    return () => {
      clearInterval(timerInterval)
    }
  }, [startTime, endTime])

  const resetTimer = () => {
    setFormattedTime("00:00:00")
    setIsClockRunning(false)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
    setMilliseconds(0)
  }

  return {
    formattedTime,
    isClockRunning,
    hours,
    minutes,
    seconds,
    milliseconds,
    resetTimer,
    setIsClockRunning,
  }
}

export default useTimer
