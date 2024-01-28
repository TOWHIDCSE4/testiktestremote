import { useEffect } from "react"
import useGetMachineClassTonsUnit from "../../../hooks/timerLogs/useMachineClassTonsUnits"
import { useSocket } from "../../../store/useSocket"
import TimerTableRowMobile from "./TimerTableRowMobile"
import { useQueryClient } from "@tanstack/react-query"

export default function TimerTableMobileComponent({
  location,
  timers,
  machineClass,
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
  const { data: totalTons, refetch: refetchMachineClassesTonsUnits } =
    useGetMachineClassTonsUnit({
      locationId: location._id,
      machineClassId: machineClass.machineClass._id,
    })

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      console.log("__EVENT_DATA", data)
      if (data?.message === "refetch") {
        queryClient.invalidateQueries([
          "machine-class-unit-tons",
          location._id,
          machineClass.machineClass._id,
        ])
        // refetchMachineClassesTonsUnits()
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
    <table className="w-full text-md">
      <thead className="font-bold">
        <td className="px-2">Timer</td>
        <td className="px-2">Units</td>
        <td className="px-2">Tons</td>
        <td></td>
      </thead>
      <tbody>
        {timers.map((item: any, index: any) => (
          <>
            <tr
              className={`border-t border-gray-400 border-opacity-20 ${
                item == 3 ? "opacity-30" : ""
              }`}
            >
              <td className="w-full px-2">{item.machine.name}</td>
              <TimerTableRowMobile
                key={item?._id}
                rowData={item}
                index={index}
              />
              {/* <td className="">
              <div
                className={`${
                  item == 0
                    ? "bg-green-500"
                    : item == 1
                    ? "bg-red-500"
                    : item == 2
                    ? "bg-yellow-500"
                    : "bg-transparent"
                } border border-slate-500 rounded-full w-[6px] h-[6px]`}
              ></div>
            </td> */}
            </tr>
            <tr className="text-xs">
              <td className="pl-4" colSpan={5}>
                <td className="opacity-30 line-clamp-1">{item.part.name}</td>
              </td>
            </tr>
          </>
        ))}
        <tr className="font-bold bg-white bg-opacity-20">
          <td></td>
          <td className="text-right uppercase">Total</td>
          <td className="px-2">{totalTons?.item?.units}</td>
          <td className="px-2">{totalTons?.item?.tons?.toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}
