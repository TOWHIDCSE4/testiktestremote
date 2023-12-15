"use client"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"
import useGetLocationProductionTime from "../../../../hooks/timers/useGetLocationProductionTime"
import { clear } from "console"

const InProduction = ({
  locationId,
  isLoading,
}: {
  locationId: string
  isLoading: boolean
}) => {
  const {
    data: productionTime,
    isLoading: isProductionTimeLoading,
    refetch,
  } = useGetLocationProductionTime(locationId)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [timeInSeconds, setTimeInSeconds] = useState(0)
  const [localTimeArray, setLocalTimeArray] = useState<Array<number | string>>(
    []
  )
  const [intervalId, setIntervalId] = useState<number>(0)

  const runLocalTime = () => {
    const interval: any = setInterval(() => {
      setTimeInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setIntervalId(interval)
    setIsClockRunning(true)
  }

  useEffect(() => {
    if (
      typeof productionTime?.item === "number" &&
      productionTime?.item > 0 &&
      timeInSeconds === 0
    ) {
      runLocalTime()
      setTimeInSeconds(productionTime.item)
    } else if (typeof productionTime?.item !== "number" && timeInSeconds > 0) {
      setTimeInSeconds(0)
      clearInterval(intervalId)
      setIntervalId(0)
    } else if (
      typeof productionTime?.item === "number" &&
      productionTime?.item === 0
    ) {
      setTimeInSeconds(0)
      clearInterval(intervalId)
      setIntervalId(0)
    }
  }, [productionTime, locationId])

  useEffect(() => {
    setLocalTimeArray(hourMinuteSecond(timeInSeconds))
  }, [timeInSeconds])

  return (
    <div className="rounded-md bg-white shadow p-2 text-center">
      <h5 className="text-lg text-gray-700 uppercase font-bold">
        {localTimeArray[0]}:{localTimeArray[1]}:{localTimeArray[2]}
      </h5>
      <h6 className="uppercase text-gray-400 font-medium text-sm">
        In Production
      </h6>
    </div>
  )
}

export default InProduction
