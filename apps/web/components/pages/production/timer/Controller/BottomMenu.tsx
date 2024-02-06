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
      stopCycle({ isStopInterval: true })
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
    <div
      className={`${
        !stopMenu ? "translate-y-[calc(100%-30px)]" : "translate-y-0"
      } absolute -translate-x-[50%] bg-dark-blue h-62 dark:outline dark:outline-2 dark:outline-white w-96 z-20 bottom-0 rounded-t-md px-4 pb-5 transition transform duration-1000`}
    >
      <div className="flex items-center justify-center mt-1 mb-0">
        {stopMenu ? (
          <ChevronDoubleDownIcon
            className="w-4 h-4 text-green-500 cursor-pointer"
            onClick={() => setStopMenu(false)}
          />
        ) : (
          <ChevronDoubleUpIcon
            className="w-4 h-4 text-green-500 cursor-pointer"
            onClick={() => setStopMenu(true)}
          />
        )}
      </div>
      <div className="bg-[#274263] rounded-md mt-1 h-full flex flex-col justify-start items-center">
        <button
          type="button"
          className="w-24 py-2 mt-2 text-yellow-200 uppercase rounded-md shadow-lg xl:text-xl 2xl:text-4xl 2xl:mt-6 bg-dark-blue hover:shadow-2xl"
          onClick={() => stop()}
        >
          Stop
        </button>
        <div className="grid grid-cols-2 px-4 mt-4 gap-x-6 gap-y-2">
          <div className="flex items-center mt-1 space-x-2 2xl:space-x-4 xl:mt-3 2xl:mt-6">
            <input
              id="machine-error"
              aria-describedby="machine-error-description"
              name="machine-error"
              type="checkbox"
              checked={stopReasons.includes("Machine Error")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
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
          <div className="flex items-center space-x-2 2xl:space-x-4 xl:mt-2 2xl:mt-3">
            <input
              id="material-low"
              aria-describedby="material-low-description"
              name="material-low"
              type="checkbox"
              checked={stopReasons.includes("Material Low")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
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
          <div className="flex items-center space-x-2 2xl:space-x-4 xl:mt-2 2xl:mt-3">
            <input
              id="machine-cleaning"
              aria-describedby="machine-cleaning-description"
              name="machine-cleaning"
              type="checkbox"
              checked={stopReasons.includes("Machine Cleaning")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.checked) {
                  setStopReasons([...stopReasons, "Machine Cleaning"])
                } else {
                  setStopReasons(
                    stopReasons.filter(
                      (reason) => reason !== "Machine Cleaning"
                    )
                  )
                }
              }}
            />
            <label
              htmlFor="machine-cleaning"
              className="text-yellow-200 xl:text-xl 2xl:text-4xl"
            >
              <span>Machine Cleaning</span>
            </label>
          </div>
          <div className="flex items-center space-x-2 2xl:space-x-4 xl:mt-2 2xl:mt-3">
            <input
              id="maintenance"
              aria-describedby="maintenance-description"
              name="maintenance"
              type="checkbox"
              checked={stopReasons.includes("Maintenance")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
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
          <div className="flex items-center mb-4 space-x-2 2xl:space-x-4 xl:mt-2 2xl:mt-3">
            <input
              id="change-part"
              aria-describedby="change-part-description"
              name="change-part"
              type="checkbox"
              checked={stopReasons.includes("Change Part")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
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
          <div className="flex items-center space-x-2 2xl:space-x-4 xl:mt-2 2xl:mt-3">
            <input
              id="personal-injury"
              aria-describedby="personal-injury-description"
              name="personal-injury"
              type="checkbox"
              checked={stopReasons.includes("Personal Injury")}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded 2xl:h-6 2xl:w-6 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.checked) {
                  setStopReasons([...stopReasons, "Personal Injury"])
                } else {
                  setStopReasons(
                    stopReasons.filter((reason) => reason !== "Personal Injury")
                  )
                }
              }}
            />
            <label
              htmlFor="personal-injury"
              className="text-yellow-200 xl:text-xl 2xl:text-4xl"
            >
              Personal Injury
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
