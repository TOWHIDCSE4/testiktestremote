"use client"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"

const LocalTime = ({
  timeZone,
  isLoading,
}: {
  timeZone: string
  isLoading: boolean
}) => {
  const [timeInSeconds, setTimeInSeconds] = useState(0)
  const [localTimeArray, setLocalTimeArray] = useState<Array<number | string>>(
    []
  )
  const [intervalId, setIntervalId] = useState<number>(0)
  useEffect(() => {
    if (timeZone) {
      const localeTimeInSeconds = dayjs
        .tz(dayjs(), !isLoading ? timeZone : "")
        .format()
      const localeTimeStartOfDay = dayjs
        .tz(dayjs(), !isLoading ? timeZone : "")
        .startOf("day")
        .format()
      const totalSecondsPass = dayjs(localeTimeInSeconds).diff(
        localeTimeStartOfDay,
        "second"
      )
      setTimeInSeconds(totalSecondsPass)
    }
    return () => clearInterval(intervalId)
  }, [timeZone])

  useEffect(() => {
    setLocalTimeArray(hourMinuteSecond(timeInSeconds))
  }, [timeInSeconds])

  const runLocalTime = () => {
    const interval: any = setInterval(() => {
      setTimeInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setIntervalId(interval)
  }

  useEffect(() => {
    runLocalTime()
  }, [])
  return (
    <div className="rounded-md bg-white shadow p-2 text-center">
      <h5 className="text-lg text-gray-700 uppercase font-bold">
        {localTimeArray[0]}:{localTimeArray[1]}:{localTimeArray[2]}
      </h5>
      <h6 className="uppercase text-gray-400 font-medium text-sm">
        Local Time
      </h6>
    </div>
  )
}

export default LocalTime
