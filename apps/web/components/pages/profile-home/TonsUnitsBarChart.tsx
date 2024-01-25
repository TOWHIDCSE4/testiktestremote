"use client"
import React, { useEffect, useState } from "react"
// @ts-ignore
import { Radio } from "antd"
import useLocations from "../../../hooks/locations/useLocations"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"
import { useSocket } from "../../../store/useSocket"

const TonsUnitsBarChart = () => {
  const socket = useSocket((state: any) => state.instance)

  const [isUnits, setIsUnits] = useState<"tons" | "units">("units")
  const { data: locations } = useLocations()
  const locationBasedUnitsTons = useGetLocationTotals()

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        locationBasedUnitsTons.refetch()
      }
    }

    if (socket) {
      socket.on("timer-event", handleTimerEvent)
    }

    return () => {
      if (socket) {
        socket.off("timer-event", handleTimerEvent)
      }
    }
  }, [socket])

  return (
    <div className="flex flex-col w-[300px] ml-4">
      <div className="flex justify-end">
        <Radio.Group
          defaultValue="units"
          size="small"
          onChange={(e: any) => setIsUnits(e.target.value)}
        >
          <Radio.Button value="units">Units</Radio.Button>
          <Radio.Button value="tons">Tons</Radio.Button>
        </Radio.Group>
      </div>

      {locations?.items?.map((location, index) => {
        const locationTonsUnits = locationBasedUnitsTons.data?.item?.find(
          (item: any) => {
            return item._id === location._id
          }
        )
        const bigUnit = Math.max(
          ...(locationBasedUnitsTons.data?.item?.map((item: any) => {
            return item?.totalUnits
          }) ?? [])
        )
        const bigTon = Math.max(
          ...(locationBasedUnitsTons.data?.item?.map((item: any) =>
            Math.round(Number(item?.totalTons))
          ) ?? [])
        )
        const value =
          isUnits === "units"
            ? locationTonsUnits?.totalUnits
            : Math.round(locationTonsUnits?.totalTons)

        const maxValue = isUnits === "units" ? bigUnit : bigTon

        const bgColor =
          value === maxValue
            ? "bg-slate-800"
            : value > maxValue / 2
            ? "bg-slate-600"
            : "bg-slate-400"

        const textColor =
          value === maxValue
            ? "text-slate-800"
            : value > maxValue / 2
            ? "text-slate-600"
            : "text-slate-400"

        const barWidth = `${(value / maxValue) * 100}%`

        return (
          <div key={location._id} className="flex items-center gap-1">
            <div
              className={`w-16 text-xs font-bold text-right uppercase text-slate-600 ${textColor}`}
            >
              {location.name}
            </div>
            <div className="overflow-hidden w-60">
              <div
                className={`border border-slate-900 h-2 ${bgColor}`}
                style={{ width: barWidth }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TonsUnitsBarChart
