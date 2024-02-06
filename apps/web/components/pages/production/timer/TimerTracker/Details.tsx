import { T_TimerLog } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"
import { usePathname } from "next/navigation"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"

const Details = ({
  timerMachine,
  locationId,
  timerId,
}: {
  page: number
  setPage: Dispatch<number>
  logs: T_TimerLog[]
  logCount: number
  timerMachine: string
  maxPage: number
  locationId: string
  timerId: string
  machineClassId: string
}) => {
  const { data, isLoading } = useGetAllTimerLogs({
    timerId,
    locationId,
    paginated: false,
  })
  const unitsCreated = data?.items
    ? data?.items.filter((item) => item.stopReason.includes("Unit Created"))
    : []
  const [gainTimeArray, setGainTimeArray] = useState<Array<number | string>>([
    "00",
    "00",
    "00",
  ])
  const [lossTimeArray, setLossTimeArray] = useState<Array<number | string>>([
    "00",
    "00",
    "00",
  ])
  const [floatTimeArray, setFloatTimeArray] = useState<Array<number | string>>([
    "00",
    "00",
    "00",
  ])

  useEffect(() => {
    if (data?.items && data?.items.length > 0) {
      const totalGainTime = data?.items.reduce(
        (acc, log) =>
          acc +
          (log.status === "Gain" && log.stopReason.includes("Unit Created")
            ? Number(log.time)
            : 0),
        0
      )

      setGainTimeArray(hourMinuteSecond(totalGainTime))
      const totalLossTime = data?.items.reduce(
        (acc, log) =>
          acc +
          (log.status === "Loss" && log.stopReason.includes("Unit Created")
            ? Number(log.time)
            : 0),
        0
      )

      const averageTime = calculateAverageTime(data.items)
      setLossTimeArray(hourMinuteSecond(totalLossTime))

      const fullGainTime = calculateFullGainTime(averageTime)
      const fullLossTime = calculateFullLossTime(averageTime)
      const floatTime = calculateFloatTime(fullGainTime, fullLossTime)

      setFloatTimeArray(hourMinuteSecond(Math.abs(floatTime)))
    } else {
      setGainTimeArray(hourMinuteSecond(0))
      setLossTimeArray(hourMinuteSecond(0))
      setFloatTimeArray(hourMinuteSecond(0))
    }
  }, [data])

  const calculateAverageTime = (items: any[]) => {
    const totalSeconds = items.reduce((acc, log) => acc + Number(log.time), 0)
    return totalSeconds / items.length
  }

  // Function to calculate full gain time
  const calculateFullGainTime = (averageTime: number) => {
    return averageTime * (data?.items?.length ?? 0)
  }

  // Function to calculate full loss time
  const calculateFullLossTime = (averageTime: number) => {
    return averageTime * (data?.items?.length ?? 0)
  }

  // Function to calculate float time
  const calculateFloatTime = (fullGainTime: number, fullLossTime: number) => {
    return fullGainTime + fullLossTime - 60 * 60 // Subtracting 60 minutes
  }

  const pathName = usePathname()
  const path = pathName.substring(0, 25)

  return (
    <>
      <div className="">
        <div className="md:flex justify-between border-t border-gray-300 px-4 lg:px-8 py-3">
          <div>
            <h6
              className={`${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              }
                uppercase font-semibold text-gray-700 leading-6`}
            >
              {isLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 w-28 rounded bg-slate-200"></div>
                </div>
              ) : (
                <>
                  Total Gain:{" "}
                  <span className="text-green-500">
                    {gainTimeArray[0]}:{gainTimeArray[1]}:{gainTimeArray[2]}
                  </span>
                </>
              )}
            </h6>
            <h6
              className={`${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              } uppercase font-semibold text-gray-700 leading-6`}
            >
              {isLoading ? (
                <div className="animate-pulse flex space-x-4 mt-2">
                  <div className="h-4 w-28 rounded bg-slate-200"></div>
                </div>
              ) : (
                <>
                  Total Loss:{" "}
                  <span className="text-red-500">
                    {lossTimeArray[0]}:{lossTimeArray[1]}:{lossTimeArray[2]}
                  </span>
                </>
              )}
            </h6>
            <h6
              className={`${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              } uppercase font-semibold text-gray-700 leading-6`}
            >
              {isLoading ? (
                <div className="animate-pulse flex space-x-4 mt-2">
                  <div className="h-4 w-28 rounded bg-slate-200"></div>
                </div>
              ) : (
                <>
                  Total Float:{" "}
                  <span className="text-green-500">
                    {floatTimeArray[0]}:{floatTimeArray[1]}:{floatTimeArray[2]}
                  </span>
                </>
              )}
            </h6>
          </div>
          <div>
            <div>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-semibold text-gray-700 leading-6`}
              >
                {isLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-4 w-36 rounded bg-slate-200"></div>
                  </div>
                ) : (
                  <>
                    {timerMachine} Total Unit: {unitsCreated.length}
                  </>
                )}
              </h6>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-semibold text-gray-700 leading-6`}
              >
                {isLoading ? (
                  <div className="animate-pulse flex space-x-4 mt-2">
                    <div className="h-4 w-36 rounded bg-slate-200"></div>
                  </div>
                ) : (
                  <>
                    {timerMachine} Total Tons:{" "}
                    {unitsCreated
                      ? unitsCreated
                          .reduce(
                            (acc, log) =>
                              acc +
                              (typeof log.partId === "object"
                                ? Number(log.partId.tons)
                                : 0),
                            0
                          )
                          .toFixed(3)
                      : "0.000"}
                  </>
                )}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Details
