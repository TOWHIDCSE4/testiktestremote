"use client"
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Footer from "./Footer"
import { usePathname } from "next/navigation"

const Table = ({
  timerId,
  locationId,
  timerMachine,
}: {
  timerId: string
  locationId: string
  timerMachine: string
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    isRefetching: isPaginatedRefetching,
    page,
    setPage,
  } = useGetAllTimerLogs({ timerId, locationId, paginated: true })
  const { data } = useGetAllTimerLogs({ timerId, locationId })

  const pathName = usePathname()
  const path = pathName.substring(0, 25)

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-8 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Cycle
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Date
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Part/Product
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Operator
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  ID
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Status
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Time
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <a href="#" className="group inline-flex items-center">
                  Stop Reason
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
              >
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginated?.items &&
              paginated?.items.map((item, idx, array) => (
                <tr key={idx}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {item.cycle}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {dayjs
                      .tz(dayjs(item.createdAt), "America/Chicago")
                      .format("MM/DD/YYYY")}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {typeof item.partId === "object" ? item.partId.name : ""}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {typeof item.operator === "object"
                      ? item.operator?.firstName
                      : ""}{" "}
                    {typeof item.operator === "object"
                      ? item.operator?.lastName
                      : ""}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {item._id ? item._id.slice(-6) : ""}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {item.status === "Gain" ? (
                      <span className="font-bold text-green-500">
                        {item.status}
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {item.status === "Gain" ? (
                      <span className="font-bold text-green-500">
                        {item.time.toFixed(2)}
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        {item.time.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {item.stopReason.join(", ")}
                  </td>
                  <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <EllipsisVerticalIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                  </td>
                </tr>
              ))}
            {isPaginatedLoading || isPaginatedRefetching ? (
              <div className="flex items-center justify-center my-4">
                <div
                  className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent text-dark-blue rounded-full my-1"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : null}
          </tbody>
        </table>
      </div>
      <Footer
        page={typeof page === "number" ? page : 0}
        setPage={setPage}
        logs={data?.items || []}
        logCount={data?.itemCount || 0}
        timerMachine={timerMachine}
        maxPage={data?.itemCount ? Math.ceil(data?.itemCount / 5) : 0}
        locationId={locationId}
        timerId={timerId}
      />
    </>
  )
}

export default Table
