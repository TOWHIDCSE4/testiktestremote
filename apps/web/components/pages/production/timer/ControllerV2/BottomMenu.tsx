import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid"
import { useContext, useState } from "react"
import { ControllerContext } from "./ControllerContext"

export default function BottomMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { setStopReasons, onStopCycleWithReasons, stopReasons } =
    useContext(ControllerContext)
  const stopReasonsArr = (
    [
      "Machine Error",
      "Machine Low",
      "Worker Break",
      "Maintenance",
      "Change Part",
    ] as const
  ).map((v) => {
    if (v === "Machine Low") return "Material Low"
    return v
  })
  return (
    <div className="absolute bottom-0 left-[50%] w-full">
      <div
        data-open={isOpen}
        className="relative w-96 transition-transform -translate-x-[50%] translate-y-[calc(100%-30px)] data-[open=true]:translate-y-0 bg-dark-blue h-62 px-2 rounded-t-lg"
      >
        <div className="flex items-center justify-center h-[30px]">
          {isOpen ? (
            <ChevronDoubleDownIcon
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <ChevronDoubleUpIcon
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
        <div className="bg-[#274263] py-2 rounded-md mt-1 h-full flex flex-col justify-start items-center">
          <button
            type="button"
            className="w-24 py-2 mt-2 text-xl text-yellow-200 uppercase rounded-md shadow-lg bg-dark-blue hover:shadow-2xl"
            onClick={onStopCycleWithReasons}
          >
            Stop
          </button>
          <div className="grid grid-cols-2 px-4 mt-4 gap-x-6 gap-y-2">
            {stopReasonsArr.map((item, key) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="machine-error"
                  checked={stopReasons.includes(item)}
                  onClick={() => {
                    if (stopReasons.includes(item)) {
                      setStopReasons((prev: any) =>
                        prev.filter((cItem: any) => cItem !== item)
                      )
                    } else {
                      setStopReasons((prev: any[]) => [...prev, item])
                    }
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <label className="text-xl text-yellow-200">{item}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
