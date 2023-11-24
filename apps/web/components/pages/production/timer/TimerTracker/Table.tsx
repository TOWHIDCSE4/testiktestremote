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
import { Dispatch, useEffect } from "react"
import { Button, Tooltip } from "antd"
import moment from "moment"

const Table = ({
  timerId,
  locationId,
  timerMachine,
  setDailyUnits,
  machineClassId,
}: {
  timerId: string
  locationId: string
  timerMachine: string
  setDailyUnits?: Dispatch<number>
  machineClassId: string
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    isRefetching: isPaginatedRefetching,
    page,
    setPage,
  } = useGetAllTimerLogs({
    timerId,
    locationId,
    paginated: true,
    countPerPage: 5,
  })
  const { data } = useGetAllTimerLogs({ timerId, locationId })
  const today = moment()

  const pathName = usePathname()
  const path = pathName.substring(0, 25)

  useEffect(() => {
    if (setDailyUnits && typeof data?.itemCount === "number") {
      setDailyUnits(data?.itemCount || 0)
    }
  }, [data])

  function formatTime(seconds: string) {
    const duration = moment.duration(seconds, "seconds")
    const minutes = duration.minutes()
    const remainingSeconds = duration.seconds()

    let result = ""

    if (minutes > 0) {
      result += `${minutes} min`
    }

    if (remainingSeconds > 0) {
      if (result !== "") {
        result += ", "
      }
      result += `${remainingSeconds} sec`
    }
    return result
  }

  return (
    <>
      <div className="w-full overflow-y-hidden">
        <table className="w-full divide-y divide-gray-300">
          <thead className="border-b-2 border-blue-950">
            <tr>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-4 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Cycle
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Date
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Product
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Operator
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-0 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  ID
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Status
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Time
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className={`${
                  path === "/production/timer/tracker"
                    ? "text-sm xl:text-xl 2xl:text-2xl"
                    : "text-sm"
                } pl-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
              >
                <div className="group inline-flex items-center">
                  Stop Reason
                  <span className="ml-2 flex-none rounded text-gray-400">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </th>
              {/* <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
              >
                <span className="sr-only">Edit</span>
              </th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {paginated?.items &&
              paginated?.items.map((item, idx, array) => (
                <tr
                  key={idx}
                  className={`${!item.jobId ? "bg-red-50" : ""} border-0`}
                >
                  <td
                    className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-4 ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    {item.cycle}
                  </td>
                  <td
                    className={`px-0 py-4 text-sm text-gray-500 flex flex-col ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    <span>
                      {dayjs
                        .tz(dayjs(item.createdAt), "America/Chicago")
                        .format("MM/DD/YYYY")}
                    </span>
                    <span>
                      {dayjs
                        .tz(dayjs(item.createdAt), "America/Chicago")
                        .format("h:mm A")}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-4 text-sm text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    <Tooltip
                      title={
                        <span style={{ padding: "0px 0.3em" }}>
                          {typeof item.partId === "object"
                            ? item.partId.name
                            : ""}
                        </span>
                      }
                      trigger="hover"
                    >
                      {typeof item.partId === "object" ? item.partId.name : ""}
                    </Tooltip>
                  </td>
                  <td
                    className={`px-3 py-4 text-sm text-gray-500 ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    {item.operator === null
                      ? (item.operatorName as string)
                      : (item.operator as string)
                      ? //@ts-expect-error
                        `${item.operator?.firstName} ${item.operator?.lastName}`
                      : ""}
                  </td>
                  <td
                    className={`px-0 py-4 text-sm text-gray-500 ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    {item.globalCycle ? item.globalCycle : ""}
                  </td>
                  <td className={`px-3 py-4 text-sm text-gray-500`}>
                    {item.status === "Gain" ? (
                      <span
                        className={`font-bold ${
                          item.jobId ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className={`px-3 py-4 text-sm`}>
                    {item.status === "Gain" ? (
                      <span
                        className={`font-bold ${
                          item.jobId ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatTime(item.time.toFixed(2))}
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        {formatTime(item.time.toFixed(2))}
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-3 py-4 text-sm text-gray-500 ${
                      item.jobId ? "text-gray-900" : "text-red-500"
                    }`}
                  >
                    {item.stopReason.join(", ")}
                  </td>
                  <td className="relative py-4 pl-3 text-right text-sm font-medium">
                    <EllipsisVerticalIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isPaginatedLoading ? (
          <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
            <div
              className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full my-1 mx-2"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
        {!isPaginatedLoading && paginated?.items.length === 0 ? (
          // <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
          <table className="w-full text-gray-500 text-lg font-semibold">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td
                  className={`py-10 pl-4 pr-3 ${
                    index === 4 ? "" : "border-b"
                  }  text-sm font-medium sm:pl-6 lg:pl-8 `}
                ></td>
                <td
                  className={`px-8 ${
                    index === 4 ? "" : "border-b"
                  } py-10 text-sm text-gray-500 flex flex-col `}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-16 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-10 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm text-gray-500`}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm`}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 4 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`py-10 px-24 ${
                    index === 4 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
                <td
                  className={`py-10 px-8 ${
                    index === 4 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
              </tr>
            ))}
          </table>
        ) : null}
        {paginated?.items.length === 1 && (
          <table className="w-full text-gray-500 text-lg font-semibold border-t-[1px] border-gray-200">
            {Array.from({ length: 4 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td
                  className={`py-10 pl-4 pr-3 ${
                    index === 3 ? "" : "border-b"
                  }  text-sm font-medium sm:pl-6 lg:pl-8 `}
                ></td>
                <td
                  className={`px-8 ${
                    index === 3 ? "" : "border-b"
                  } py-10 text-sm text-gray-500 flex flex-col `}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-16 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-10 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm text-gray-500`}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm`}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 3 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`py-10 px-24 ${
                    index === 3 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
                <td
                  className={`py-10 px-8 ${
                    index === 3 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
              </tr>
            ))}
          </table>
        )}

        {paginated?.items.length === 2 && (
          <table className="w-full text-gray-500 text-lg font-semibold border-t-[1px] border-gray-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="border">
                <td
                  className={`py-10 pl-4 pr-3 ${
                    index === 2 ? "" : "border-b"
                  }  text-sm font-medium sm:pl-6 lg:pl-8 `}
                ></td>
                <td
                  className={`px-8 ${
                    index === 2 ? "" : "border-b"
                  } py-10 text-sm text-gray-500 flex flex-col `}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-16 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-10 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm text-gray-500`}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm`}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 2 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`py-10 px-24 ${
                    index === 2 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
                <td
                  className={`py-10 px-8 ${
                    index === 2 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
              </tr>
            ))}
          </table>
        )}

        {paginated?.items.length === 3 && (
          <table className="w-full text-gray-500 text-lg font-semibold border-t-[1px] border-gray-200">
            {Array.from({ length: 2 }).map((_, index) => (
              <tr key={index} className="border">
                <td
                  className={`py-10 pl-4 pr-3 ${
                    index === 1 ? "" : "border-b"
                  }  text-sm font-medium sm:pl-6 lg:pl-8 `}
                ></td>
                <td
                  className={`px-8 ${
                    index === 1 ? "" : "border-b"
                  } py-10 text-sm text-gray-500 flex flex-col `}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-16 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-10 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm text-gray-500`}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm`}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 1 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`py-10 px-24 ${
                    index === 1 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
                <td
                  className={`py-10 px-8 ${
                    index === 1 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
              </tr>
            ))}
          </table>
        )}

        {paginated?.items.length === 4 && (
          <table className="w-full text-gray-500 text-lg font-semibold border-t-[1px] border-gray-200">
            {Array.from({ length: 1 }).map((_, index) => (
              <tr key={index} className="border">
                <td
                  className={`py-10 pl-4 pr-3 ${
                    index === 0 ? "" : "border-b"
                  }  text-sm font-medium sm:pl-6 lg:pl-8 `}
                ></td>
                <td
                  className={`px-8 ${
                    index === 0 ? "" : "border-b"
                  } py-10 text-sm text-gray-500 flex flex-col `}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-16 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`px-10 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm text-gray-500`}
                ></td>
                <td
                  className={`px-14 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm`}
                ></td>
                <td
                  className={`px-12 py-10 ${
                    index === 0 ? "" : "border-b"
                  } text-sm text-gray-500 `}
                ></td>
                <td
                  className={`py-10 px-24 ${
                    index === 0 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
                <td
                  className={`py-10 px-8 ${
                    index === 0 ? "" : "border-b"
                  } text-right text-sm font-medium sm:pr-6 lg:pr-8`}
                ></td>
              </tr>
            ))}
          </table>
        )}
      </div>
      <Footer
        page={typeof page === "number" ? page : 0}
        setPage={setPage}
        logs={paginated?.items || []}
        logCount={data?.itemCount || 0}
        timerMachine={timerMachine}
        maxPage={data?.itemCount ? Math.ceil(data?.itemCount / 5) : 0}
        locationId={locationId}
        timerId={timerId}
        machineClassId={machineClassId}
      />
    </>
  )
}

export default Table
