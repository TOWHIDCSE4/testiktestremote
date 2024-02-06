import { T_DeviceLog } from "custom-validator"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"

export default function DeviceLogsTableComponent({
  logs,
  height,
  pageSize = 10,
}: {
  logs?: T_DeviceLog[]
  height?: string
  pageSize?: number
}) {
  const [page, setPage] = useState<number>(0)
  const paginatedItems = useMemo(() => {
    if (!logs) return []
    return logs.slice(page * pageSize, (page + 1) * pageSize)
  }, [logs, pageSize, page])
  const totalPages = useMemo(() => {
    if (!logs || logs.length == 0) return 0
    return Math.ceil(logs.length / pageSize)
  }, [pageSize, logs])
  const onPrev = () => {
    if (page < 1) return false
    setPage((prev) => prev - 1)
  }
  const onNext = () => {
    if (page >= totalPages - 1) return false
    setPage((prev) => prev + 1)
  }

  return (
    <div
      style={{ height: height }}
      className={`w-full gap-2 flex flex-col ${
        height ? `` : `h-[400px]`
      } max-h-full`}
    >
      <div className="flex-1 w-full overflow-auto scrollbar-w-xs">
        <table className="logs-table">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems?.map((log) => (
              <tr key={log._id} className="border-t border-slate-200">
                <td>
                  <div className="flex flex-col items-center">
                    <div className="text-2xs">
                      {dayjs(log.createdAt).format("MM/DD/YY")}
                    </div>
                    <div className="text-xs font-bold">
                      {dayjs(log.createdAt).format("HH:mm:ss")}
                    </div>
                  </div>
                </td>
                <td className="w-[99%]">{log.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between w-full">
        <button
          disabled={page < 1}
          onClick={onPrev}
          className="p-1 text-lg text-white rounded-lg bg-indigo-blue"
        >
          <HiChevronLeft />
        </button>
        <div className="flex items-center justify-center gap-1">
          <button className="p-1 text-white rounded-full bg-indigo-blue">
            {page + 1}
          </button>
          <div className="text-disabled">of</div>
          <button className="p-1 text-white rounded-full bg-indigo-blue">
            {totalPages}
          </button>
        </div>
        <button
          disabled={page >= totalPages - 1}
          onClick={onNext}
          className="p-1 text-lg text-white rounded-lg bg-indigo-blue"
        >
          <HiChevronRight />
        </button>
      </div>
    </div>
  )
}
