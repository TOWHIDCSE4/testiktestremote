import { T_TimerLog } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"

const Footer = ({
  page,
  setPage,
  logs,
  logCount,
  timerMachine,
  maxPage,
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
}) => {
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
  return (
    <div className="w-full mt-52">
      <div className="">
        <div className="md:flex justify-between border-t border-gray-300 px-4 lg:px-8 py-3">
          <div>
            <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
              {timerMachine} Total Units: {logCount}
            </h6>
            <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
              {timerMachine} Total Tons:{" "}
              {logs
                ? logs
                    .reduce(
                      (acc, log) =>
                        acc +
                        (typeof log.partId === "object"
                          ? Number(log.partId.pounds)
                          : 0),
                      0
                    )
                    .toFixed(3)
                : "0.000"}
            </h6>
            <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
              Total Gain:{" "}
              <span className="text-green-500">
                {gainTimeArray[0]}:{gainTimeArray[1]}:{gainTimeArray[2]}
              </span>
            </h6>
            <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
              Total Loss:{" "}
              <span className="text-red-500">
                {lossTimeArray[0]}:{lossTimeArray[1]}:{lossTimeArray[2]}
              </span>
            </h6>
            <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
              Total Float: <span className="text-amber-600">00:00:00</span>
            </h6>
          </div>
          <div>
            <button
              className="relative mt-3 md:mt-0 inline-flex items-center rounded-md bg-blue-950 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-offset-0"
              onClick={openReport}
            >
              View Report
            </button>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between border-t border-gray-300 px-4 lg:px-8 py-3">
          <div>
            <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
              Overall Units: 0
            </h6>
            <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
              Overall Tons: 0.000
            </h6>
          </div>
          <div>
            <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
              Global Units: 0
            </h6>
            <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
              Global Tons: 0.000
            </h6>
          </div>
        </div>
      </div>
      <div>
        <nav
          className="flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 lg:px-8"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{logs.length}</span> of{" "}
              <span className="font-medium">{Math.ceil(logCount / 5)}</span>{" "}
              result{Math.ceil(logCount / 5) > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page < 2}
            >
              Previous
            </button>
            <button
              type="button"
              className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => setPage(page + 1)}
              disabled={page === maxPage}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Footer
