import React, { useEffect } from "react"
import useTotalTonsUnit from "../../../hooks/timers/useTotalTonsUnit"
import { useSocket } from "../../../store/useSocket"
import combineClasses from "../../../helpers/combineClasses"
import useGetTimerIsEnded from "../../../hooks/timers/useGetTimerIsEnded"
import useTimerStatus from "../../../hooks/timers/useGetTimerStatus"

interface Props {
  rowData: any
  index: number
}

const TimerTableRowMobile: React.FC<Props> = async ({ rowData, index }) => {
  const socket = useSocket((state: any) => state.instance)
  
  const query = useTotalTonsUnit({
    locationId: rowData.locationId,
    timerId: rowData._id,
  })

  const status = useTimerStatus({
    locationId: rowData.locationId,
    timerId: rowData._id,
  })

  const isTimerEnded = useGetTimerIsEnded({ timerId: rowData._id })

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      console.log("__EVENT_DATA", data)
      if (data?.message === "refetch") {
        query.refetch()
        status.refetch()
      }
    }

    // Check if socket is defined before attaching the event listener
    if (socket) {
      socket.on("timer-event", handleTimerEvent)
    }

    // Return a cleanup function
    return () => {
      // Check if socket is defined before detaching the event listener
      if (socket) {
        socket.off("timer-event", handleTimerEvent)
      }
    }
  }, [socket])
  
  return (
    <tr>
      <td className="px-3">{query?.data?.item?.dailyUnits}</td>
      <td className="px-3">{query?.data?.item?.tons?.toFixed(2)}</td>
      <td>
      <div
          className={combineClasses(
            "border border-slate-500 rounded-full w-[6px] h-[6px]",
            status.data?.items[0]?.status === "Loss" && "bg-red-500",
            status.data?.items[0]?.status === "Gain" && "bg-green-500",
            isTimerEnded.data?.items[0]?.endAt && "bg-gray-500",
            isTimerEnded.data?.items[0]?.endAt &&
              !status.data?.items[0]?.stopReason.includes("Unit Created") &&
              "bg-yellow-500"
          )}
        ></div>
      </td>
    </tr>
  )
}

export default TimerTableRowMobile