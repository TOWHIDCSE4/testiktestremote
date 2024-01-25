"use client"
import React, { useEffect } from "react"
import { HiChevronDoubleDown } from "react-icons/hi"
import TonsUnitsBarChart from "./TonsUnitsBarChart"
import useGetAllLocationTonsUnits from "../../../hooks/timers/useGetAllLocationsTonsUnits"
import { useSocket } from "../../../store/useSocket"
import dayjs from "dayjs"

const ProductionEyeTableFooter = () => {
  const socket = useSocket((state: any) => state.instance)

  const allLocationTonsUnits = useGetAllLocationTonsUnits()

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        allLocationTonsUnits.refetch()
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
    <div className="flex items-center w-full px-2 py-2 border border-gray-300 rounded-b-2xl">
      <div className="relative flex items-center flex-1">
        <HiChevronDoubleDown className="text-3xl text-gold" />
        <div className="flex flex-col ml-10 font-bold leading-4 uppercase">
          <div>Global</div>
          <div>Rundown</div>
        </div>
        <TonsUnitsBarChart />
        <div className="mx-4"></div>
        <div className="flex items-center gap-8 pl-4 font-bold leading-4 uppercase border-l-4 border-slate-900">
          <div className="flex flex-col">
            <div>Units</div>
            <div className="text-slate-400">
              {allLocationTonsUnits.data?.item?.dailyUnits ?? 0}
            </div>
          </div>
          <div className="flex flex-col">
            <div>Tons</div>
            <div className="text-slate-400">
              {allLocationTonsUnits.data?.item?.tons?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mr-2 text-sm uppercase">
        <div className="flex justify-end gap-1">
          <div className="text-gray-400">
            {dayjs().format("MMMM DD YYYY")} :
          </div>
          <div className="font-bold">Date</div>
        </div>
        <div className="flex justify-end gap-1">
          <div className="text-gray-400">{dayjs().format("hh:mm A")} :</div>
          <div className="font-bold">Time</div>
        </div>
      </div>
    </div>
  )
}

export default ProductionEyeTableFooter
