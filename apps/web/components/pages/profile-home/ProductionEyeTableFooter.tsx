"use client"
import { useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useEffect } from "react"
import { HiChevronDoubleDown } from "react-icons/hi"
import useGetAllLocationTonsUnits from "../../../hooks/timers/useGetAllLocationsTonsUnits"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"
import { useSocket } from "../../../store/useSocket"
import TonsUnitsBarChart from "./TonsUnitsBarChart"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"

const ProductionEyeTableFooter = () => {
  const queryClient = useQueryClient()
  const socket = useSocket((state: any) => state.instance)

  const { selectedLocationIds, primaryLocationId } = useProductionEyeContext()

  const allLocationTonsUnits = useGetAllLocationTonsUnits()

  const locationBasedUnitsTons = useGetLocationTotals()
  const data =
    selectedLocationIds.length <= 1
      ? locationBasedUnitsTons.data?.item.find((loc: any) => {
          return loc._id === primaryLocationId
        })
      : locationBasedUnitsTons.data?.item
          .filter((loc: any) => selectedLocationIds.includes(loc._id))
          .reduce(
            (acc: any, next: any) => {
              return {
                totalUnits: acc.totalUnits + next.totalUnits,
                totalTons: acc.totalTons + next.totalTons,
              }
            },
            { totalUnits: 0, totalTons: 0 }
          )

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        queryClient.invalidateQueries(["all-location-tons-units"])
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
    <div className="flex flex-col items-center w-full gap-2 px-2 py-2 border border-gray-300 rounded-b-2xl">
      <div className="relative flex flex-col items-center w-full gap-2">
        <div className="relative w-full">
          <HiChevronDoubleDown className="absolute top-0 left-0 text-xl text-gold" />
          <div className="text-2xl font-bold leading-4 text-center uppercase">
            Global Rundown
          </div>
        </div>
        <TonsUnitsBarChart />
        <div className="flex items-center justify-between w-auto gap-8 pl-4 text-2xl font-bold leading-4 uppercase">
          <div className="flex flex-1 gap-2">
            <div>Units</div>
            <div className="text-slate-400">
              {data?.totalUnits ?? allLocationTonsUnits.data?.item?.dailyUnits}
            </div>
          </div>
          <div className="flex flex-1 gap-2">
            <div>Tons</div>
            <div className="text-slate-400">
              {data?.totalTons?.toFixed(2) ??
                allLocationTonsUnits.data?.item?.tons?.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex gap-1 text-sm text-gray-400 uppercase">
          <div className="">{dayjs().format("MMMM DD YYYY")} </div>
          <div>|</div>
          <div className="">{dayjs().format("hh:mm A")}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductionEyeTableFooter
