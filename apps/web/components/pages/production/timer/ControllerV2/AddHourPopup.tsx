import { useContext, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { Combobox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import cn from "classnames"

const AddHourPopup = () => {
  const {
    controllerClockSeconds,
    isAddHourPopupOpen,
    setIsAddHourPopupOpen,
    onAddControllerTimerHour,
  } = useContext(ControllerContext)
  const hourDiff = (controllerClockSeconds / 3600).toFixed(1)
  const [selectedHour, setSelectedHour] = useState<number>(0)

  return (
    <div
      className={cn("absolute right-0 w-[270px] bottom-32 transition-all", {
        "translate-x-0": isAddHourPopupOpen,
        "translate-x-full": !isAddHourPopupOpen,
      })}
    >
      <div
        className={`transition-colors border-gold bg-[#bdbdbd] dark:bg-transparent dark:text-white border-2 border-r-0 rounded-l-lg flex-1 !flex-shrink-0 py-1`}
      >
        <div
          className={cn("uppercase text-[#0f2034] dark:text-white text-md p-4")}
        >
          <p>would you like to extend your production time</p>
          <Combobox value={selectedHour} onChange={(v) => setSelectedHour(v)}>
            <div className="text-gray-900 relative my-2">
              <Combobox.Input
                displayValue={(v) => (v ? `${v} hour` : "")}
                placeholder="Select hour"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                <ChevronUpDownIcon className={`h-5 w-5`} />
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <Combobox.Option
                  className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                  value={1}
                >
                  1 Hour
                </Combobox.Option>
                <Combobox.Option
                  className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                  value={2}
                >
                  2 Hour
                </Combobox.Option>
                <Combobox.Option
                  className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                  value={3}
                >
                  3 Hour
                </Combobox.Option>
                <Combobox.Option
                  className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                  value={4}
                >
                  4 Hour
                </Combobox.Option>
                <Combobox.Option
                  className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                  value={5}
                >
                  5 Hour
                </Combobox.Option>
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
        <div className="flex items-center justify-between mx-auto w-fit gap-4">
          <button
            onClick={() => {
              onAddControllerTimerHour(selectedHour)
              setIsAddHourPopupOpen(false)
            }}
            disabled={!selectedHour}
            tabIndex={-1}
            className={cn(
              "border-2 border-[#90959b] bg-[#e8ebf0] leading-none rounded-lg text-2xl px-3 font-semibold",
              {
                "opacity-50 text-gray-400": !selectedHour,
                "opacity-100 text-[#0f2034] ": selectedHour,
              }
            )}
          >
            OK
          </button>
          <button
            onClick={() => {
              setIsAddHourPopupOpen(false)
            }}
            tabIndex={-1}
            disabled={selectedHour > 0}
            className={cn(
              "border-2 border-[#90959b] bg-[#e8ebf0] leading-none rounded-lg text-[#0f2034] text-2xl px-3 font-semibold",
              {
                "opacity-50 text-gray-400": selectedHour > 0,
                "opacity-100 text-[#0f2034] ": !selectedHour,
              }
            )}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddHourPopup
