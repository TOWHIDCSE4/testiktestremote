import React, { Dispatch } from "react"
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/solid"
import { T_TimerStopReason } from "custom-validator"
import toast from "react-hot-toast"

const BottomMenu = ({
  stopMenu,
  setStopMenu,
  stopReasons,
  setStopReasons,
  stopCycle,
  isCycleClockRunning,
}: {
  stopMenu: boolean
  setStopMenu: Dispatch<boolean>
  stopReasons: T_TimerStopReason[]
  setStopReasons: Dispatch<T_TimerStopReason[]>
  stopCycle: Function
  isCycleClockRunning: boolean
}) => {
  const stop = () => {
    if (stopReasons.length > 0 && isCycleClockRunning) {
      stopCycle()
    } else {
      if (!isCycleClockRunning) {
        toast.error("Cycle clock is not running")
      } else {
        if (stopReasons.length === 0) {
          toast.error("Please select at least one reason")
        }
      }
    }
  }
  return (
    <div className="flex justify-center">
      <div
        className={`${
          stopMenu
            ? "translate-y-0"
            : "translate-y-[191px] xl:translate-y-[297px] 2xl:translate-y-[380px]"
        } bg-dark-blue h-62 xl:h-80 2xl:h-[430px] dark:outline dark:outline-2 dark:outline-white w-96 xl:w-[500px] 2xl:w-[800px] z-20 fixed bottom-0 rounded-t-md px-4 pb-5 transition transform duration-1000`}
      >
        <div className="flex justify-center items-center mt-1 2xl:mt-3 mb-0 2xl:mb-2">
          {stopMenu ? (
            <ChevronDoubleDownIcon
              className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
              onClick={() => setStopMenu(false)}
            />
          ) : (
            <ChevronDoubleUpIcon
              className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
              onClick={() => setStopMenu(true)}
            />
          )}
        </div>
        <div className="bg-[#274263] rounded-md mt-1 h-full flex flex-col justify-start items-center">
          <button
            type="button"
            className="text-yellow-200 uppercase xl:text-xl 2xl:text-4xl mt-2 2xl:mt-6 bg-dark-blue rounded-md shadow-lg hover:shadow-2xl w-24 py-2"
            onClick={() => stop()}
          >
            Stop
          </button>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 px-4">
            <div className="flex space-x-2 2xl:space-x-4 items-center mt-1 xl:mt-3 2xl:mt-6">
              <input
                id="machine-error"
                aria-describedby="machine-error-description"
                name="machine-error"
                type="checkbox"
                checked={stopReasons.includes("Machine Error")}
                className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setStopReasons([...stopReasons, "Machine Error"])
                  } else {
                    setStopReasons(
                      stopReasons.filter((reason) => reason !== "Machine Error")
                    )
                  }
                }}
              />
              <label
                htmlFor="machine-error"
                className="text-yellow-200 xl:text-xl 2xl:text-4xl"
              >
                Machine Error
              </label>
            </div>
            <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
              <input
                id="material-low"
                aria-describedby="material-low-description"
                name="material-low"
                type="checkbox"
                checked={stopReasons.includes("Material Low")}
                className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setStopReasons([...stopReasons, "Material Low"])
                  } else {
                    setStopReasons(
                      stopReasons.filter((reason) => reason !== "Material Low")
                    )
                  }
                }}
              />
              <label
                htmlFor="material-low"
                className="text-yellow-200 xl:text-xl 2xl:text-4xl"
              >
                Machine Low
              </label>
            </div>
            <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
              <input
                id="worker-break"
                aria-describedby="worker-break-description"
                name="worker-break"
                type="checkbox"
                checked={stopReasons.includes("Worker Break")}
                className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setStopReasons([...stopReasons, "Worker Break"])
                  } else {
                    setStopReasons(
                      stopReasons.filter((reason) => reason !== "Worker Break")
                    )
                  }
                }}
              />
              <label
                htmlFor="worker-break"
                className="text-yellow-200 xl:text-xl 2xl:text-4xl"
              >
                Worker Break
              </label>
            </div>
            <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
              <input
                id="maintenance"
                aria-describedby="maintenance-description"
                name="maintenance"
                type="checkbox"
                checked={stopReasons.includes("Maintenance")}
                className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setStopReasons([...stopReasons, "Maintenance"])
                  } else {
                    setStopReasons(
                      stopReasons.filter((reason) => reason !== "Maintenance")
                    )
                  }
                }}
              />
              <label
                htmlFor="maintenance"
                className="text-yellow-200 xl:text-xl 2xl:text-4xl"
              >
                Maintenance
              </label>
            </div>
            <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3 mb-4">
              <input
                id="change-part"
                aria-describedby="change-part-description"
                name="change-part"
                type="checkbox"
                checked={stopReasons.includes("Change Part")}
                className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setStopReasons([...stopReasons, "Change Part"])
                  } else {
                    setStopReasons(
                      stopReasons.filter((reason) => reason !== "Change Part")
                    )
                  }
                }}
              />
              <label
                htmlFor="change-part"
                className="text-yellow-200 xl:text-xl 2xl:text-4xl"
              >
                Change Part
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
