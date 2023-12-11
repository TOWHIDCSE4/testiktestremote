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
  const totalPage = timerLogs?.length
    ? Math.ceil(timerLogs.length / perPage)
    : 0
  const data = timerLogs?.items?.slice(startIndex, endIndex) || []
  return (
    <div
      className={cn("w-fit relative", {
        hidden: !isOpen,
      })}
    >
      <div className="fixed inset-0 w-[70%] flex flex-col  mx-auto rounded shadow-lg items-center justify-center p-4 bg-white h-fit top-[50%]">
        <table className="w-full">
          <thead className="border-b-4 border-blue-800 font-bold h-10">
            <th>Date / Time</th>
            <th>Machine</th>
            <th>Part</th>
            <th>Status</th>
            <th>Cycle Time</th>
            <th>Cycle</th>
          </thead>
          <tbody>
            {data.map((log: any, i: any) => (
              <tr
                key={log._id}
                className={cn("text-center h-10", {
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
                <td>{log.cycle}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="self-end flex gap-4 items-center mt-2">
          <p>
            Page: {page} of {totalPage}
          </p>
          <div className="flex rounded-md border-gray-500 border overflow-hidden">
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
        <div
          className=" font-bold absolute top-0 right-2 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          X
        </div>
      </div>
    </div>
  )
}

export default TimerLogsModal
