"use client"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { PrinterIcon } from "@heroicons/react/24/solid"
import DarkLogo from "../../../../assets/logo/logo-dark.png"
import Image from "next/image"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import useLocation from "../../../../hooks/locations/useLocation"
import useGetAllTimerLogs from "../../../../hooks/timerLogs/useGetAllTimerLogs"
import useGetTimerDetails from "../../../../hooks/timers/useGetTimerDetails"
import { useEffect, useState } from "react"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"

const Report = ({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const [totals, setTotals] = useState({
    totalUnits: 0,
    totalTons: 0,
    total: 0,
  })
  const [gainTimeArray, setGainTimeArray] = useState<Array<number | string>>([])
  const [lossTimeArray, setLossTimeArray] = useState<Array<number | string>>([])
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { data, isLoading } = useGetAllTimerLogs({ timerId, locationId })

  useEffect(() => {
    if (data?.items && data?.items?.length > 0) {
      setGainTimeArray(
        hourMinuteSecond(
          data?.items.reduce(
            (acc, log) => acc + (log.status === "Gain" ? Number(log.time) : 0),
            0
          )
        )
      )
      setLossTimeArray(
        hourMinuteSecond(
          data?.items.reduce(
            (acc, log) => acc + (log.status === "Loss" ? Number(log.time) : 0),
            0
          )
        )
      )
    }
  }, [data])

  return (
    <>
      <header className="flex justify-between bg-neutral-900 px-8 py-3">
        <h4 className="text-gray-400 font-bold">Powered by Iekomedia</h4>
        <div className="flex space-x-4">
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
          <PrinterIcon className="h-5 w-5 text-white cursor-pointer" />
        </div>
      </header>
      <main className="px-8">
        <div className="flex justify-between mt-8">
          <div className="logo-container relative w-[200px] h-[50px]">
            <Image src={DarkLogo} fill alt="Logo" />
          </div>

          <div className="text-right">
            <div className="text-sm">
              <span className="text-gray-800 font-bold">City:</span>{" "}
              {timerDetailData?.item?.locationId.name}
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Factory:</span>{" "}
              {timerDetailData?.item?.factoryId.name}
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Machine Class:</span>{" "}
              {timerDetailData?.item?.machineClassId.name}
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Machine:</span>{" "}
              {timerDetailData?.item?.machineId.name}
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Report:</span>{" "}
              {dayjs
                .tz(
                  dayjs(),
                  timerDetailData?.item?.locationId.timeZone
                    ? timerDetailData?.item?.locationId.timeZone
                    : ""
                )
                .format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
        <h3 className="uppercase text-gray-800 font-bold text-3xl mt-10">
          Totals
        </h3>
        <h4 className="text-lg text-gray-800 mt-4">
          <b>Total Units:</b> {data?.itemCount || 0}
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Tons:</b>{" "}
          {data?.items
            ? data.items
                .reduce(
                  (acc, log) =>
                    acc +
                    (typeof log.partId === "object"
                      ? Number(log.partId.pounds)
                      : 0),
                  0
                )
                .toFixed(3)
            : "0.000"}
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Time of Gain: </b>
          {gainTimeArray.length > 0 ? (
            <span className="text-green-500">
              {gainTimeArray[0]}:{gainTimeArray[1]}:{gainTimeArray[2]}
            </span>
          ) : null}
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Time of Loss: </b>
          {lossTimeArray.length > 0 ? (
            <span className="text-red-500">
              {lossTimeArray[0]}:{lossTimeArray[1]}:{lossTimeArray[2]}
            </span>
          ) : null}
        </h4>
        <h3 className="uppercase text-gray-800 font-bold text-3xl mt-8">
          Cycles
        </h3>
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                No
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
                ID
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
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Start
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!isLoading && data?.items && data?.items?.length > 0 ? (
              data?.items?.map((log, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {log.cycle}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {typeof log?.partId === "object" ? log?.partId.name : ""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {log._id ? log._id.slice(-6) : ""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {typeof log.operator === "object"
                      ? log.operator?.firstName
                      : ""}{" "}
                    {typeof log.operator === "object"
                      ? log.operator?.lastName
                      : ""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {log.time.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : !isLoading && data?.items && data?.items?.length === 0 ? (
              <tr className="relative">
                <td className="py-3 text-sm text-gray-500 absolute right-0 border-b border-gray-200 flex w-full justify-center">
                  No data
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
      </main>
    </>
  )
}

export default Report
