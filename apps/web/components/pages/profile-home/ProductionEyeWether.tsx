"use client"
import React from "react"
import useWether from "../../../hooks/timers/useWether"

const ProductionEyeWether = () => {
  const gunter = useWether(33.4479, -96.7475)
  const conroe = useWether(30.312927, -95.4560512)
  const seguin = useWether(29.5979964, -98.1041023)
  return (
    <div className="flex justify-center text-xs space-x-2">
      <div className="flex  font-semibold">
        <div>Area Temp :</div>
        <div>Seguin :</div>
        <span className="font-bold">
          {seguin.data?.current?.temperature_2m}{" "}
          <span className="text-xs font-normal align-top">
            {seguin.data?.current_units?.temperature_2m}
          </span>
        </span>
      </div>
      <div className="flex  font-semibold">
        <div>Conroe :</div>
        <span className="font-bold">
          {conroe.data?.current?.temperature_2m}{" "}
          <span className="text-xs font-normal align-top1">
            {conroe.data?.current_units?.temperature_2m}
          </span>
        </span>
      </div>
      <div className="flex  font-semibold">
        <div>Gunter :</div>
        <span className="font-bold">
          {gunter.data?.current?.temperature_2m}{" "}
          <span className="text-xs font-normal align-top">
            {gunter.data?.current_units?.temperature_2m}
          </span>
        </span>
      </div>
    </div>
  )
}

export default ProductionEyeWether
