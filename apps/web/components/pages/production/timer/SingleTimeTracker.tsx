"use client"
import { T_Timer } from "custom-validator"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import useTimersByLocation from "../../../../hooks/timers/useTimersByLocation"
import Table from "./TimerTracker/Table"

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

const SingleTimeTracker = ({
  locationId,
  machineClassId,
}: {
  locationId: string
  machineClassId: string
}) => {
  const pathName = usePathname()
  const {
    data: timersByLocation,
    isLoading: isTimersByLocationLoading,
    setLocationId,
  } = useTimersByLocation()
  const [timers, setTimers] = useState<T_Timer[]>([])
  const [selectedTimerMachine, setSelectedTimerMachine] = useState<string>("")
  const [selectedTimerId, setSelectedTimerId] = useState<string>("")
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")

  const openFullScreenTracker = () => {
    window.open(
      `/production/timer/tracker/${locationId}/${machineClassId}`,
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
      setTimers(timers as T_Timer[])
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
            <div className={`w-full`}>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                  defaultValue={
                    timers.find((tab) => tab._id === selectedTimerId)?._id
                  }
                >
                  {timers.map((tab) => (
                    <option key={tab._id}>{tab?.machine?.name}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav
                  className="isolate flex divide-x divide-gray-200"
                  aria-label="Tabs"
                >
                  {timers.map((tab, tabIdx) => (
                    <button
                      key={tabIdx}
                      className={classNames(
                        selectedTimerId === tab._id
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700",
                        tabIdx === 0 ? "" : "",
                        tabIdx === tabs.length - 1 ? "" : "",
                        "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
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
                          "absolute inset-x-0 bottom-0 h-1"
                        )}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          {/* Table */}
          <Table
            timerId={selectedTimerId}
            locationId={selectedLocationId}
            timerMachine={selectedTimerMachine}
          />
        </div>
      </div>
    </div>
  )
}
export default SingleTimeTracker
