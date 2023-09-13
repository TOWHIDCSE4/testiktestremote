import { T_TimerLog } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"
import { usePathname } from "next/navigation"
import useGetOverallTotal from "../../../../../hooks/timerLogs/useGetOverallTotal"

const Details = ({
  page,
  setPage,
  logs,
  logCount,
  timerMachine,
  maxPage,
  locationId,
  timerId,
  machineClassId,
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
  const { data: overallUnitTons, isLoading: isOverallUnitTonsLoading } =
    useGetOverallTotal({
      locationId,
      machineClassId,
    })
  const [gainTimeArray, setGainTimeArray] = useState<Array<number | string>>([])
  const [lossTimeArray, setLossTimeArray] = useState<Array<number | string>>([])
  const [floatTimeArray, setFloatTimeArray] = useState<Array<number | string>>(
    []
  )

  const openReport = () => {
    window.open(
      `/production/timer/report/${locationId}/${timerId}`,
      "Timer Tracker",
      "location,status,scrollbars,resizable,width=800, height=800"
    )
  }

  useEffect(() => {
    setGainTimeArray(
      hourMinuteSecond(
        logs.reduce(
          (acc, log) => acc + (log.status === "Gain" ? Number(log.time) : 0),
          0
        )
      )
    )
    setLossTimeArray(
      hourMinuteSecond(
        logs.reduce(
          (acc, log) => acc + (log.status === "Loss" ? Number(log.time) : 0),
          0
        )
      )
    )
  }, [logs])

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
              Total Gain:{" "}
              <span className="text-green-500">
                {gainTimeArray[0]}:{gainTimeArray[1]}:{gainTimeArray[2]}
              </span>
            </h6>
            <h6
              className={`${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              } uppercase font-semibold text-gray-700 leading-6`}
            >
              Total Loss:{" "}
              <span className="text-red-500">
                {lossTimeArray[0]}:{lossTimeArray[1]}:{lossTimeArray[2]}
              </span>
            </h6>
            <h6
              className={`${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              } uppercase font-semibold text-gray-700 leading-6`}
            >
              Total Float: <span className="text-amber-600">00:00:00</span>
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
                {timerMachine} Total Units: {logCount}
              </h6>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-semibold text-gray-700 leading-6`}
              >
                {timerMachine} Total Tons:{" "}
                {logs
                  ? logs
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
              </h6>
              {/* <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-bold text-gray-700 leading-6`}
              >
                Overall Units:{" "}
                {overallUnitTons?.item?.units
                  ? overallUnitTons?.item?.units
                  : "0"}
              </h6>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-bold text-gray-700 leading-6`}
              >
                Overall Tons:{" "}
                {overallUnitTons?.item?.tons
                  ? overallUnitTons?.item?.tons.toFixed(3)
                  : "0.000"}
              </h6> */}
            </div>
            {/* <div>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-bold text-gray-700 leading-6`}
              >
                Global Units: 0
              </h6>
              <h6
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } uppercase font-bold text-gray-700 leading-6`}
              >
                Global Tons: 0.000
              </h6>
            </div> */}
          </div>
          {/* <div className="flex flex-col text-right">
            <button
              className={`
              ${
                path === "/production/timer/tracker"
                  ? "text-sm xl:text-xl 2xl:text-2xl"
                  : "text-sm"
              } relative mt-3 md:mt-0 inline-flex items-center rounded-md bg-blue-950 px-3 py-2 font-semibold text-white focus-visible:outline-offset-0`}
              onClick={openReport}
            >
              View Report
            </button>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Details
