"use client"
import dayjs from "dayjs"
import Image from "next/image"
import Cookies from "js-cookie"
import * as utc from "dayjs/plugin/utc"
import { Key, useEffect, useState } from "react"
import * as timezone from "dayjs/plugin/timezone"
import { PrinterIcon } from "@heroicons/react/24/solid"
import DarkLogo from "../../../../assets/logo/logo-dark.png"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { API_URL_TIMER_LOGS } from "../../../../helpers/constants"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"
import useGlobalTimerLogsMulti from "../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"
import { T_Locations, T_Machine, T_MachineClass } from "custom-validator"

const GlobalTableReport = ({
  data,
  city,
  keyword,
  job,
  process,
  sortType,
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
  job?: any
  city: string
  keyword: string
  sortType: string
  process: boolean
  factoryId: string[]
  machineId: string[]
  locationId: string[]
  data: any | undefined
  machineClassId: string[]
  startDateRange: string
  endDateRange: string
  partId: string[]
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
  const [paginated, setPaginated] = useState(data)
  const [gainTimeArray, setGainTimeArray] = useState<Array<number | string>>([])
  const [lossTimeArray, setLossTimeArray] = useState<Array<number | string>>([])
  const { data: result, isLoading } = useGlobalTimerLogsMulti(
    [city],
    sortType,
    keyword,
    process
  )

  //@ts-expect-error
  const locationIdQueryString = new URLSearchParams({
    locationId: locationId,
  }).toString()
  //@ts-expect-error
  const factoryIdQueryString = new URLSearchParams({
    factoryId: factoryId,
  }).toString()
  //@ts-expect-error
  const machineIdQueryString = new URLSearchParams({
    machineId: machineId,
  }).toString()
  //@ts-expect-error
  const machineClassIdQueryString = new URLSearchParams({
    machineClassId: machineClassId,
  }).toString()
  //@ts-expect-error
  const partIdQueryString = new URLSearchParams({ partId: partId }).toString()

  useEffect(() => {
    const fetchpaginated = async () => {
      const token = Cookies.get("tfl")
      console.log(
        `${API_URL_TIMER_LOGS}/global/multi/filter?${locationIdQueryString}&${factoryIdQueryString}&${partIdQueryString}&${machineIdQueryString}&${machineClassIdQueryString}&startDate=${startDateRange}&endDate=${endDateRange}&sort=${sortType}&key=${keyword}locationId=${city}&page=${1}&limit=${
          paginated?.itemCount
        }`
      )
      const res = await fetch(
        `${API_URL_TIMER_LOGS}/global/multi/filter?${locationIdQueryString}&${factoryIdQueryString}&${partIdQueryString}&${machineIdQueryString}&${machineClassIdQueryString}&startDate=${startDateRange}&endDate=${endDateRange}&sort=${sortType}&key=${keyword}locationId=${city}&page=${1}&limit=${
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
    var css = "@page { size: landscape; }"
    var head = document.head || document.getElementsByTagName("head")[0]
    var style = document.createElement("style")

    style.type = "text/css"
    style.media = "print"

    if ((style as any).sheet) {
      ;(style as any).sheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
  }, [])
  console.log("🚀 ~ file: GlobalReport.tsx:75 ~ paginated:", paginated)
  return (
    <>
      <header className="flex justify-between bg-neutral-900 px-8 py-3">
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
                {machineClassData.map((item) => item.name).join(", ")}
              </div>
            )}
            {machineData.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">Machine:</span>{" "}
                {machineData.map((item) => item.name).join(", ")}
              </div>
            )}
            {startDateRange && endDateRange && (
              <div className="text-sm">
                <span className="text-gray-800 font-bold">Date Range:</span>{" "}
                {[
                  dayjs(startDateRange as string).format("MM/DD/YYYY"),
                  dayjs(endDateRange as string).format("MM/DD/YYYY"),
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
                .format("DD/MM/YYYY")}
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
        {/* <h5 className="text-lg text-gray-800">
          <b>Total Time of Gain: </b>
          {gainTimeArray.length > 0 ? (
            <span className="text-green-500">
              {gainTimeArray[0]}:{gainTimeArray[1]}:{gainTimeArray[2]}
            </span>
          ) : null}
        </h5>
        <h5 className="text-lg text-gray-800">
          <b>Total Time of Loss: </b>
          {lossTimeArray.length > 0 ? (
            <span className="text-red-500">
              {lossTimeArray[0]}:{lossTimeArray[1]}:{lossTimeArray[2]}
            </span>
          ) : null}
        </h5> */}

        <h6 className="uppercase text-gray-800 font-bold text-xl mt-8">
          Cycles
        </h6>
        {paginated?.items?.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-300 mt-4">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Cycle
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Start Time
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Machine
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Part
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Operator
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {log.cycle}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {log?.createdAt
                          ? `${dayjs(log?.createdAt as string).format(
                              "MM/DD/YYYY"
                            )}`
                          : ""}{" "}
                        <span className="font-bold">
                          {log?.createdAt
                            ? `${dayjs(log?.createdAt as string).format(
                                "HH:mm"
                              )}`
                            : ""}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {typeof log?.machineId === "object"
                          ? log?.machineId.name
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {typeof log?.partId === "object"
                          ? log?.partId.name
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {typeof log.operator === "object"
                          ? log.operator?.firstName
                          : ""}{" "}
                        {typeof log.operator === "object"
                          ? log.operator?.lastName
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {log.globalCycle ? log.globalCycle : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
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
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {log.time.toFixed(2)}s
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
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
        )}
      </main>
    </>
  )
}

export default GlobalTableReport
