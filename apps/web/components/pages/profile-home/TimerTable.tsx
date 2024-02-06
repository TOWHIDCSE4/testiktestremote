"use client"
import TimerTableRow from "./TimerTableRow"
import useGetMachineClassTonsUnit from "../../../hooks/timerLogs/useMachineClassTonsUnits"
import { useEffect } from "react"
import { useSocket } from "../../../store/useSocket"
import { useQueryClient } from "@tanstack/react-query"

export default function TimerTableComponent({
  location,
  machineClass,
  timers,
}: {
  location: {
    name: string
    _id?: string
  }
  machineClass: any
  timers: any
}) {
  const queryClient = useQueryClient()
  const socket = useSocket((state: any) => state.instance)

  const { data: totalTons } = useGetMachineClassTonsUnit({
    locationId: location?._id,
    machineClassId: machineClass?.machineClass?._id,
  })

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        queryClient.invalidateQueries([
          "machine-class-unit-tons",
          location._id,
          machineClass.machineClass._id,
        ])
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
    <table className="w-full text-xs">
      <thead className="font-bold">
        <td className="px-2">Timer</td>
        <td className="">Part</td>
        <td className="px-2">Units</td>
        <td className="px-2">Tons</td>
        <td></td>
      </thead>
      <tbody>
        {timers?.length > 0
          ? timers?.map((item: any, index: number) => (
              <TimerTableRow key={item?._id} rowData={item} index={index} />
            ))
          : null}
        <tr className="font-bold bg-white bg-opacity-20">
          <td></td>
          <td className="text-right uppercase">Total</td>
          <td className="px-2 !w-fit">
            {String(totalTons?.item?.units ?? 0).padStart(4, "0")}
          </td>
          <td className="px-2 !w-fit">
            {totalTons?.item?.tons?.toFixed(2).padStart(7, "0")}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}
