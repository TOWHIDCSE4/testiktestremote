"use client"
import dayjs from "dayjs"
import Image from "next/image"
import Cookies from "js-cookie"
import * as utc from "dayjs/plugin/utc"
import { Key, useEffect, useState } from "react"
import * as timezone from "dayjs/plugin/timezone"
import { PrinterIcon } from "@heroicons/react/24/solid"
import DarkLogo from "../../../../../assets/logo/logo-dark.png"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { API_URL_TIMER_LOGS } from "../../../../../helpers/constants"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"
import useGlobalTimerLogsMulti from "../../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"
import { T_Locations, T_Machine, T_MachineClass } from "custom-validator"
import { T_SelectItem } from "../CustomSelect"

const SystemReport = ({
  data,
  // city,
  //   job,
  isIncludeCycle,
  process,
  locationId,
  factoryId,
  machineId,
  partId,
  startDateRange,
  endDateRange,
  machineClassId,
  locationData,
  machineClassData,
  machineData,
  newWindowRef,
}: {
  //   job?: any
  // city: string[]
  isIncludeCycle?: boolean
  keyword: string
  sortType: string
  process: boolean
  factoryId: string[]
  machineId: string[] | undefined
  locationId: string[]
  data: any | undefined
  machineClassId: string[] | undefined
  startDateRange: string
  endDateRange: string
  partId: string[] | undefined
  locationData: T_Locations[]
  machineClassData: T_MachineClass[]
  machineData: T_Machine[]
  newWindowRef: any
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const [totals, setTotals] = useState({
    totalUnits: 0,
    totalTons: 0,
    total: 0,
  })
  const [keyword, setKeyword] = useState<string>("createdAt")
  const [sortType, setSortType] = useState<string>("desc")
  const [gainTimeArray, setGainTimeArray] = useState<Array<number | string>>([])
  const [lossTimeArray, setLossTimeArray] = useState<Array<number | string>>([])
  const { data: result, isLoading } = useGlobalTimerLogsMulti(
    locationId,
    sortType,
    keyword,
    process
  )
  const [paginated, setPaginated] = useState(data)

  const handleInputChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    const newValue = e.currentTarget.value
    setKeyword(key)
    setSortType(sortType === "asc" ? "desc" : "asc")
  }

  console.log("HELLO", machineClassData)

  const locationIdQueryString = new URLSearchParams({
    locationId: locationId as unknown as string,
  }).toString()

  //@ts-expect-error
  const factoryIdQueryString = new URLSearchParams({
    factoryId: factoryId,
  }).toString()

  //@ts-expect-error
  const machineIdQueryString = new URLSearchParams({
    machineId: machineId,
    // as unknown as string,
  }).toString()
  //@ts-expect-error
  const machineClassIdQueryString = new URLSearchParams({
    machineClassId: machineClassId,
    // as unknown as string,
  }).toString()
  //@ts-expect-error
  const partIdQueryString = new URLSearchParams({
    partId: partId,
    // as unknown as string,
  }).toString()

  useEffect(() => {
    const fetchpaginated = async () => {
      const token = Cookies.get("tfl")
      const res = await fetch(
        `${API_URL_TIMER_LOGS}/global/multi/filter?${locationIdQueryString}&${factoryIdQueryString}&${partIdQueryString}&${machineIdQueryString}&${machineClassIdQueryString}&startDate=${startDateRange}&endDate=${endDateRange}&sort=${sortType}&key=${keyword}&page=${1}&limit=${
          paginated?.itemCount
        }`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const responseJSON = await res.json()
      setPaginated(responseJSON)
    }
    fetchpaginated()
  }, [paginated])

  useEffect(() => {
    if (paginated?.items && paginated?.items?.length > 0) {
      setGainTimeArray(
        hourMinuteSecond(
          paginated?.items.reduce(
            (acc: number, log: { status: string; time: any }) =>
              acc + (log.status === "Gain" ? Number(log.time) : 0),
            0
          )
        )
      )
      setLossTimeArray(
        hourMinuteSecond(
          paginated?.items.reduce(
            (acc: number, log: { status: string; time: any }) =>
              acc + (log.status === "Loss" ? Number(log.time) : 0),
            0
          )
        )
      )
    }
  }, [paginated])

  const handlePrint = () => {
    if (newWindowRef.current) {
      newWindowRef?.current?.window.print()
    }
  }

  // useEffect for convert portrait to landscape
  useEffect(() => {
    const css = "@page { size: landscape; }"
    const head = document.head || document.getElementsByTagName("head")[0]
    const style = document.createElement("style")

    style.type = "text/css"
    style.media = "print"

    if ((style as any).sheet) {
      (style as any).sheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
  }, [])

  return (
    <>
      <header className="flex w-full justify-between bg-neutral-900 px-8 py-3">
        <h5 className="text-gray-400 font-bold">Powered by Iekomedia</h5>
        <div className="flex space-x-4">
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
          <PrinterIcon
            className="h-5 w-5 text-white cursor-pointer"
            onClick={handlePrint}
          />
        </div>
      </header>
      <main className="px-8">
        <div className="flex justify-between mt-8">
          <div className="logo-container relative w-[150px] h-[30px]">
            <Image src={DarkLogo} fill alt="Logo" />
          </div>

          <div className="text-right">
            {locationData.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">City:</span>{" "}
                {locationData.map((item) => item.name).join(", ")}
              </div>
            )}
            {machineClassData.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">Machine Class:</span>{" "}
                {machineClassData.map((item) => item?.name).join(", ")}
              </div>
            )}
            {machineData.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">Machine:</span>{" "}
                {machineData.map((item) => item?.name).join(", ")}
              </div>
            )}
            {startDateRange && endDateRange && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">Date Range:</span>{" "}
                {[
                  dayjs(startDateRange as string).format("MM/DD/YYYY"),
                  dayjs(endDateRange as string)
                    .subtract(1, "day")
                    .format("MM/DD/YYYY"),
                ]
                  .map((item) => item)
                  .join(" - ")}
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Report:</span>{" "}
              {dayjs
                .tz(
                  dayjs(),
                  paginated?.item?.locationId.timeZone
                    ? paginated?.item?.locationId.timeZone
                    : ""
                )
                .format("MM/DD/YYYY")}
            </div>
          </div>
        </div>
        <h6 className="uppercase text-gray-800 font-bold text-2xl mt-10">
          Totals
        </h6>
        <h5 className="text-md text-gray-800 mt-4">
          <b>Total Units:</b> {paginated?.itemCount || 0}
        </h5>
        <h5 className="text-md text-gray-800">
          <b>Total Tons:</b>{" "}
          {paginated?.items
            ? data?.items
                ?.reduce(
                  (acc: number, log: { partId: { tons: any } }) =>
                    acc +
                    (typeof log.partId === "object"
                      ? Number(log.partId.tons)
                      : 0),
                  0
                )
                .toFixed(3)
            : "0.000"}
        </h5>
        {isIncludeCycle ? (
          <>
            <h6 className="uppercase text-gray-800 font-bold text-xl mt-8">
              Cycles
            </h6>
            {paginated?.items?.length !== undefined ? (
              paginated?.items?.length > 0 ? (
                <table className="w-full divide-y divide-gray-300 mt-4">
                  <thead className="w-full">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 border-[1px] border-neutral-300 px-2 w-12 pr-0 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Cycle
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-48 text-center text-sm font-semibold text-gray-900 min-w-[9rem] md:min-w-[14rem]"
                      >
                        Start Time
                        <button
                          onClick={(e) => handleInputChange(e, "createdAt")}
                        >
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-48 text-center text-sm font-semibold text-gray-900 min-w-[7rem] md:min-w-[5rem]"
                      >
                        Machine
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-48 text-center text-sm font-semibold text-gray-900 min-w-[12rem] md:min-w-[16rem]"
                      >
                        Part
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-56 text-center text-sm font-semibold text-gray-900 min-w-[7rem] md:min-w-[10rem]"
                      >
                        Operator
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-56 text-center text-sm font-semibold text-gray-900 min-w-[5rem] md:min-w-[5rem]"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-56 text-center text-sm font-semibold text-gray-900 min-w-[7rem] md:min-w-[7rem]"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 border-[1px] border-neutral-300 py-3.5 w-56 text-center text-sm font-semibold text-gray-900 min-w-[4rem] md:min-w-[5rem]"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 border-[1px] border-neutral-300 justify-center text-center text-sm font-semibold text-gray-900"
                      >
                        Stop Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!isLoading &&
                    paginated?.items &&
                    paginated?.items?.length > 0 ? (
                      paginated?.items?.map(
                        (log: any, index: Key | null | undefined) => (
                          <tr key={index}>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {log.cycle}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {log?.createdAt
                                ? `${dayjs
                                    .tz(
                                      log?.createdAt as string,
                                      "America/Chicago"
                                    )
                                    .format("MM/DD/YYYY")}`
                                : ""}{" "}
                              <span className="font-bold">
                                {log?.createdAt
                                  ? `${dayjs(log?.createdAt as string).format(
                                      "HHmm"
                                    )}`
                                  : ""}
                              </span>
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {typeof log?.machineId === "object"
                                ? log?.machineId.name
                                : ""}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {typeof log?.partId === "object"
                                ? log?.partId.name
                                : ""}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {log.operator === null
                                ? log.operatorName
                                : log.operator
                                ? `${log.operator.firstName} ${log.operator.lastName}`
                                : ""}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {log.globalCycle ? log.globalCycle : ""}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {log.status === "Gain" ? (
                                <span className="font-bold text-green-500">
                                  {log.status}
                                </span>
                              ) : (
                                <span className="font-bold text-red-500">
                                  {log.status}
                                </span>
                              )}
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500">
                              {log.time.toFixed(2)}s
                            </td>
                            <td className="border-[1px] border-neutral-300 whitespace-nowrap px-3 text-center py-2 text-sm text-gray-500">
                              {log?.stopReason ? log?.stopReason : ""}
                            </td>
                          </tr>
                        )
                      )
                    ) : !isLoading &&
                      paginated?.items &&
                      paginated?.items?.length === 0 ? (
                      <tr className="relative">
                        <td className="py-3 text-sm text-gray-500 absolute right-0 border-b border-gray-200 flex w-full justify-center">
                          No paginated
                        </td>
                      </tr>
                    ) : null}
                    {isLoading ? (
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
              ) : (
                <div className="w-full text-center pt-32">
                  <h2>No Data</h2>
                </div>
              )
            ) : (
              <div className="w-full text-center pt-32">
                <h2>No Data</h2>
              </div>
            )}
          </>
        ) : null}
      </main>
    </>
  )
}

export default SystemReport
