import { T_Machine, T_Part, T_TimerLog } from "custom-validator"
import cn from "classnames"
import { formatDate, formatTime } from "../../../../../helpers/date"
import { useContext, useState } from "react"
import { ControllerContext } from "../ControllerV2/ControllerContext"

interface TimerLogsModalProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  children?: any
}

const isEven = (n: number) => n % 2 === 0
const isLoss = (text: "Gain" | "Loss") => text === "Loss"

const TimerLogsModal = ({
  isOpen,
  setIsOpen,
  children,
}: TimerLogsModalProps) => {
  const { timerLogs } = useContext(ControllerContext)
  const [page, setPage] = useState(1)
  const perPage = 5
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const totalPage = timerLogs?.items?.length
    ? Math.ceil(timerLogs?.items?.length / perPage)
    : 1
  const data =
    timerLogs?.items
      ?.toReversed()
      ?.map((log: any, i: number) => ({
        ...log,
        sortedCycle: timerLogs?.items?.length - i,
      }))
      ?.slice(startIndex, endIndex) || []
  return (
    <div
      className={cn("w-full absolute overflow-auto top-0 h-full", {
        hidden: !isOpen,
      })}
    >
      <div className="relative flex flex-col items-center justify-between w-full h-full mx-auto overflow-auto bg-white rounded shadow-lg">
        <table className="justify-between flex-1 w-full h-full overflow-auto">
          <thead className="sticky top-0 w-full h-5 font-bold bg-white border-b-4 border-blue-800">
            <th>Date / Time</th>
            <th>Machine</th>
            <th>Part</th>
            <th>Status</th>
            <th>Cycle Time</th>
            <th>Cycle</th>
          </thead>
          <tbody className="flex-1 w-full overflow-auto">
            {data.map((log: any, i: any) => (
              <tr
                key={log._id}
                className={cn("text-center h-5", {
                  "bg-gray-100": isEven(i + 1),
                  "bg-gray-200": !isEven(i + 1),
                })}
              >
                <td>{formatDate(log.createdAt, "MM/DD/YYYY hh:mm A")}</td>
                <td>{(log.machineId as T_Machine).name}</td>
                <td>{(log.partId as T_Part).name}</td>
                <td
                  className={cn({
                    "text-red-600": isLoss(log.status),
                    "text-green-600": !isLoss(log.status),
                  })}
                >
                  {log.status}
                </td>
                <td>{formatTime(log.time.toFixed(2))}</td>
                <td>{log.sortedCycle}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sticky bottom-0 flex items-center self-start gap-4 p-2 mb-2 ml-2 border border-white rounded-full shadow-lg bg-white/30 backdrop-blur-sm">
          <p>
            Page: {page} of {totalPage}
          </p>
          <div className="flex overflow-hidden border border-gray-500 rounded-md">
            <button
              className={cn(
                "px-4 py-1 hover:bg-gray-100  border-r border-gray-500",
                {
                  "text-gray-300": page === 1,
                  "hover:bg-white": page === 1,
                }
              )}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
              className={cn("px-4 py-1 hover:bg-gray-100 ", {
                "text-gray-300": page === totalPage,
                "hover:bg-white": page === totalPage,
              })}
              disabled={page === totalPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
        {/* <div
          className="absolute top-0 font-bold cursor-pointer right-2"
          onClick={() => setIsOpen(false)}
        >
          X
        </div> */}
      </div>
    </div>
  )
}

export default TimerLogsModal
