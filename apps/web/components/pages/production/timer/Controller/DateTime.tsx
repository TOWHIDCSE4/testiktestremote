import React, { useEffect, useState } from "react"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"

const DateTime = ({ timeZone }: { timeZone: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const currentDate = dayjs
    .tz(dayjs(), timeZone ? timeZone : "")
    .format("MM / DD / YYYY")
  const [timeInSeconds, setTimeInSeconds] = useState(0)
  const [localTimeArray, setLocalTimeArray] = useState<Array<number | string>>(
    []
  )
  const [intervalId, setIntervalId] = useState<number>(0)
  useEffect(() => {
    if (timeZone) {
      const localeTimeInSeconds = dayjs
        .tz(dayjs(), timeZone ? timeZone : "")
        .format()
      const localeTimeStartOfDay = dayjs
        .tz(dayjs(), timeZone ? timeZone : "")
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
    return () => clearInterval(intervalId)
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
    <>
      {currentDate} - {Number(localTimeArray[0]) % 12 || 12} :{" "}
      {localTimeArray[1]} : {localTimeArray[2]}{" "}
      {Number(localTimeArray[0]) >= 12 ? "PM" : "AM"}
    </>
  )
}

export default DateTime
