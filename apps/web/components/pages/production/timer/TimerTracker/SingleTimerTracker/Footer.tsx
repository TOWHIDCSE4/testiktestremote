import { T_TimerLog } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import { hourMinuteSecond } from "../../../../../../helpers/timeConverter"
import TrackerDetails from "./Details"
import { usePathname } from "next/navigation"

const Footer = ({
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
    <div className="w-full mt-52">
      <div
        className={`${
          path === "/production/timer/tracker"
            ? "flex flex-col-reverse absolute w-full bottom-0"
            : ""
        }`}
      >
        <div>
          <TrackerDetails
            page={page}
            setPage={setPage}
            logs={logs}
            logCount={logCount}
            timerMachine={timerMachine}
            maxPage={maxPage}
            locationId={locationId}
            timerId={timerId}
            machineClassId={machineClassId}
          />
        </div>
        <div>
          <nav
            className="flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 lg:px-8"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-lg xl:text-xl 2xl:text-2xl"
                    : "text-lg"
                } text-gray-700`}
              >
                Showing <span className="font-medium">{logs.length}</span> of{" "}
                <span className="font-medium">{Math.ceil(logCount / 5)}</span>{" "}
                result{Math.ceil(logCount / 5) > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                type="button"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-lg xl:text-xl 2xl:text-2xl"
                    : "text-lg"
                } relative inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page < 2}
              >
                Previous
              </button>
              <button
                type="button"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-lg xl:text-xl 2xl:text-2xl"
                    : "text-lg"
                } relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                onClick={() => setPage(page + 1)}
                disabled={page === maxPage}
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Footer
