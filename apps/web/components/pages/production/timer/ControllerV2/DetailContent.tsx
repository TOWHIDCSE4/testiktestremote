import { useContext, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { HiChevronDoubleDown } from "react-icons/hi"
import useColor from "./useColor"

export default function DetailContextComponent() {
  const { variant, controllerDetailData } = useContext(ControllerContext)
  const color = useColor({ variant })
  const [isOpen, setIsOpen] = useState<boolean>(true)
  return (
    <div className="text-xs sm:text-lg">
      <div className="flex items-center gap-2 mt-2">
        <h4 className="text-lg sm:text-2xl text-[#0f2034] uppercase font-bold">
          CYCLE DETAILS
        </h4>
        <button
          className={`text-${color} text-xl sm:hidden`}
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
          isOpen ? "h-fit" : "sm:h-0"
        } overflow-hidden`}
      >
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] font-semibold">Factory : </span>
          <span className="text-[#858585]">
            {controllerDetailData.factoryName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] font-semibold">Machine : </span>
          <span className="text-[#858585]">
            {controllerDetailData.machineName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] font-semibold">Product : </span>
          <span className="text-[#858585]">
            {controllerDetailData.partName}
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] font-semibold">Average Time : </span>
          <span className="text-[#858585]">
            {Math.floor(controllerDetailData.averageTime ?? 0)} Seconds
          </span>
        </div>
        <div className=" line-clamp-1">
          <span className="text-[#0f2034] font-semibold">
            Average Weight :{" "}
          </span>
          <span className="text-[#858585]">
            {controllerDetailData.weight?.toFixed(2)} Tons
          </span>
        </div>
      </div>
    </div>
  )
}
