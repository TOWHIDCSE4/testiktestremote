import { useContext, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { HiChevronDoubleDown } from "react-icons/hi"
import { textCV as textColors } from "./classVariants"

export default function DetailContextComponent() {
  const { variant, controllerDetailData } = useContext(ControllerContext)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  return (
    <div className="text-xs sm:text-lg">
      <div className="flex items-center gap-2 mt-2">
        <h4 className="text-lg sm:text-2xl text-[#0f2034] dark:text-white uppercase font-bold">
          CYCLE DETAILS
        </h4>
        <button
          className={`${textColors[variant]} text-xl sm:hidden`}
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <HiChevronDoubleDown
            className={`transition-all ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>
      <div
        className={`pl-4 transition-all ${
          isOpen ? "h-fit" : "h-0 sm:h-fit"
        } overflow-hidden`}
      >
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] dark:text-white font-semibold">
            Factory :{" "}
          </span>
          <span className="text-[#858585] dark:text-white dark:opacity-80">
            {controllerDetailData.factoryName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] dark:text-white font-semibold">
            Machine :{" "}
          </span>
          <span className="text-[#858585] dark:text-white dark:opacity-80">
            {controllerDetailData.machineName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] dark:text-white font-semibold">
            Product :{" "}
          </span>
          <span className="text-[#858585] dark:text-white dark:opacity-80">
            {controllerDetailData.partName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] dark:text-white font-semibold">
            Average Time :{" "}
          </span>
          <span className="text-[#858585] dark:text-white dark:opacity-80">
            {Math.floor(controllerDetailData.averageTime ?? 0)} Seconds
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] dark:text-white font-semibold">
            Average Weight :{" "}
          </span>
          <span className="text-[#858585] dark:text-white dark:opacity-80">
            {controllerDetailData.weight?.toFixed(2)} Tons
          </span>
        </div>
      </div>
    </div>
  )
}
