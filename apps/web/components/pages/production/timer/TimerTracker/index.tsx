"use client"
import { T_Timer } from "custom-validator"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Table from "./Table"
import useTimersByLocation from "../../../../../hooks/timers/useTimersByLocation"

const tabs = [
  { name: "RPP1225", current: true },
  { name: "30 Ton", current: false },
  { name: "40 Ton", current: false },
  { name: "RP1635", current: false },
  { name: "RP1635", current: false },
  { name: "RP1635", current: false },
  { name: "RP1635", current: false },
  { name: "RP1635", current: false },
]

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const TimerTracker = ({
  locationId,
  machineClassId,
  timers,
}: {
  locationId: string
  machineClassId: string
  timers?: T_Timer[]
}) => {
  const pathName = usePathname()
  const {
    data: timersByLocation,
    isLoading: isTimersByLocationLoading,
    setLocationId,
  } = useTimersByLocation()
  // const [timers, setTimers] = useState<T_Timer[]>([])
  const [selectedTimerMachine, setSelectedTimerMachine] = useState<string>("")
  const [selectedTimerId, setSelectedTimerId] = useState<string>("")
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")

  const openFullScreenTracker = () => {
    window.open(
      `/production/timer/tracker/${selectedTimerId}`,
      "Timer Tracker",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
  }

  useEffect(() => {
    if (locationId) {
      setLocationId(locationId)
    }
  }, [locationId])

  useEffect(() => {
    if (
      timersByLocation?.items &&
      timersByLocation?.items.length > 0 &&
      machineClassId
    ) {
      const timers = timersByLocation.items
        .map((timer: T_Timer) => {
          return timer.machineClassId === machineClassId ? timer : null
        })
        .filter((timer) => timer !== null)
      setSelectedTimerMachine(timers[0]?.machine?.name as string)
      setSelectedTimerId(timers[0]?._id as string)
      setSelectedLocationId(timers[0]?.locationId as string)
      // setTimers(timers as T_Timer[])
    }
  }, [timersByLocation, machineClassId])

  return (
    <div
      className={`drop-shadow-lg border border-gray-200 bg-white rounded-md ${
        pathName === `/production/timer/tracker/${locationId}/${machineClassId}`
          ? "mt-0 h-screen"
          : "mt-7"
      }`}
    >
      <div>
        <div>
          {/* Tabs */}
          <div
            className={`flex items-center px-4 md:px-0 mt-4 pb-4 md:pb-0 md:mt-0 shadow`}
          >
            <div
              className={`${
                pathName === "/production/timer/tracker" ? "w-full" : "w-[90%]"
              } `}
            >
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                  defaultValue={
                    timers?.find((tab) => tab._id === selectedTimerId)?._id
                  }
                >
                  {timers?.map((tab) => (
                    <option key={tab._id}>{tab?.machine?.name}</option>
                  ))}
                </select>
              </div>
              <div></div>
              <div className="hidden sm:block">
                <nav
                  className="flex divide-x divide-gray-200 isolate"
                  aria-label="Tabs"
                >
                  {timers?.map((tab, tabIdx) => (
                    <button
                      key={tabIdx}
                      className={classNames(
                        selectedTimerId === tab._id
                          ? "text-slate-50 bg-blue-950"
                          : "text-gray-500 hover:text-gray-700",
                        tabIdx === 0 ? "" : "",
                        tabIdx === tabs.length - 1 ? "" : "",
                        `group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm ${
                          selectedTimerId === tab._id
                            ? "hover:bg-blue-900"
                            : "hover:bg-gray-200"
                        } font-bold focus:z-10`
                      )}
                      onClick={() => setSelectedTimerId(tab._id as string)}
                    >
                      <span>{tab.machine?.name}</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          selectedTimerId === tab._id
                            ? "bg-blue-950"
                            : "bg-transparent",
                          "inset-x-0"
                        )}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div
              className={`w-[10%] bg-white flex justify-center ${
                pathName === "/production/timer/tracker" ? "hidden" : ""
              }`}
            >
              <button
                type="button"
                onClick={openFullScreenTracker}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
                    <g fill="#374151" transform="translate(-215 -257)">
                      <g transform="translate(215 257)">
                        <path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <Table
            timerId={selectedTimerId}
            locationId={selectedLocationId}
            timerMachine={selectedTimerMachine}
            machineClassId={machineClassId}
          />
        </div>
      </div>
    </div>
  )
}
export default TimerTracker
