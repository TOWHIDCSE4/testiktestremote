"use client"
import React, { useEffect, useState } from "react"
// @ts-ignore
import { Radio } from "antd"
import useLocations from "../../../hooks/locations/useLocations"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"
import { useSocket } from "../../../store/useSocket"
import { useQueryClient } from "@tanstack/react-query"

const TonsUnitsBarChart = () => {
  const queryClient = useQueryClient()
  const { data: locations } = useLocations()
  const socket = useSocket((state: any) => state.instance)
  const [isUnits, setIsUnits] = useState<"tons" | "units">("units")
  const locationBasedUnitsTons = useGetLocationTotals()

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        queryClient.invalidateQueries(["locations-totals"])
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
    <div className="relative flex items-center justify-between w-full gap-2 px-2 ml-2 lg:w-auto">
      <div className="flex flex-col items-center ml-4 lg:ml-0">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="u/t"
            className="sr-only peer"
            checked={isUnits == "units"}
            onChange={(e) => {
              console.log(e.target.checked)
              if (e.target.checked) setIsUnits("units")
            }}
          />
          <div className="flex items-center justify-center w-6 h-4 text-sm bg-white border-gray-300 border rounded-t-[0.3rem] peer-checked:border-slate-700 peer-checked:border-b-0 font-bold peer-checked:bg-gray-300 text-slate-700 peer-checked:text-dark-blue">
            U
          </div>
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="u/t"
            className="sr-only peer"
            checked={isUnits == "tons"}
            onChange={(e) => {
              console.log(e.target.checked)
              if (e.target.checked) setIsUnits("tons")
            }}
          />
          <div className="flex items-center justify-center w-6 h-4 text-sm bg-white border-gray-300 border border-t-0 rounded-b-[0.3rem] peer-checked:bg-gray-300 peer-checked:border-slate-700 font-bold text-slate-700 peer-checked:text-dark-blue">
            T
          </div>
        </label>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-end">
          {/* <Radio.Group
          defaultValue="units"
          size="small"
          onChange={(e: any) => setIsUnits(e.target.value)}
        >
          <Radio.Button value="units">Units</Radio.Button>
          <Radio.Button value="tons">Tons</Radio.Button>
        </Radio.Group> */}
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
              <div className="w-48 overflow-hidden md:w-60">
                <div
                  className={`border border-slate-900 h-2 ${bgColor}`}
                  style={{ width: barWidth }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TonsUnitsBarChart
