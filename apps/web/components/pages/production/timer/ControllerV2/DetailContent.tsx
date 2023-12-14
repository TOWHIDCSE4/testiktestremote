import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"

export default function DetailContextComponent() {
  const { controllerDetailData } = useContext(ControllerContext)

  return (
    <div>
      <h4 className="mt-2 text-2xl text-[#0f2034] uppercase font-bold">
        CYCLE DETAILS
      </h4>
      <div className="indent-4">
        <div>
          <span className="text-[#0f2034] font-semibold">Factory : </span>
          <span className="text-[#858585]">
            {controllerDetailData.factoryName}
          </span>
        </div>
        <div>
          <span className="text-[#0f2034] font-semibold">Machine : </span>
          <span className="text-[#858585]">
            {controllerDetailData.machineName}
          </span>
        </div>
        <div>
          <span className="text-[#0f2034] font-semibold">Product : </span>
          <span className="text-[#858585]">
            {controllerDetailData.partName}
          </span>
        </div>
        <div>
          <span className="text-[#0f2034] font-semibold">Average Time : </span>
          <span className="text-[#858585]">
            {Math.floor(controllerDetailData.averageTime ?? 0)} Seconds
          </span>
        </div>
        <div>
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
