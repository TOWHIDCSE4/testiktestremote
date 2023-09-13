"use client"
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { usePathname } from "next/navigation"
import { Dispatch, useEffect, useState } from "react"
import useGlobalTimerLogs from "../../../../../hooks/timerLogs/useGlobalTimerLogs"
import useFactories from "../../../../../hooks/factories/useFactories"
import { T_Factory, T_Machine, T_MachineClass } from "custom-validator"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClasses"
import useMachines from "../../../../../hooks/machines/useMachines"
import { set } from "mongoose"

const LogsTable = ({ locationId }: { locationId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()
  const { data: machines, isLoading: isMachinesLoading } = useMachines()
  const [filterBy, setFilterBy] = useState("All")
  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    isRefetching: isPaginatedRefetching,
    page,
    setPage,
    setFactoryId,
    setMachineClassId,
    setMachineId,
  } = useGlobalTimerLogs(locationId)
  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 5)
  const filterInputs = () => {
    if (filterBy === "Factories") {
      return (
        <select
          id="factories"
          name="factories"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setFactoryId(e.target.value)
            setMachineClassId("")
            setMachineId("")
          }}
          disabled={isFactoriesLoading || isFactoriesLoading}
        >
          <option value="">Select Factory</option>
          {factories?.items?.map((item: T_Factory, index: number) => {
            return (
              <option key={index} value={item._id as string}>
                {item.name}
              </option>
            )
          })}
        </select>
      )
    } else if (filterBy === "Machine Classes") {
      return (
        <select
          id="machineClasses"
          name="machineClasses"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setMachineClassId(e.target.value)
            setFactoryId("")
            setMachineId("")
          }}
          disabled={isMachineClassesLoading || isFactoriesLoading}
        >
          <option value="">Select Machine Classes</option>
          {machineClasses?.items?.map((item: T_MachineClass, index: number) => {
            return (
              <option key={index} value={item._id as string}>
                {item.name}
              </option>
            )
          })}
        </select>
      )
    } else if (filterBy === "Machines") {
      return (
        <select
          id="machines"
          name="machines"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setMachineId(e.target.value)
            setMachineClassId("")
            setFactoryId("")
          }}
          disabled={isMachinesLoading || isFactoriesLoading}
        >
          <option value="">Select Machines</option>
          {machines?.items?.map((item: T_Machine, index: number) => {
            return (
              <option key={index} value={item._id as string}>
                {item.name}
              </option>
            )
          })}
        </select>
      )
    } else {
      return (
        <select
          id="all"
          name="all"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled
        >
          <option></option>
        </select>
      )
    }
  }
  return (
    <>
      <div
        className={`w-full mt-12 overflow-hidden bg-white drop-shadow-lg rounded-md ${
          paginated ? "overflow-hidden" : "overflow-x-auto"
        }`}
      >
        <div className="px-6 py-4">
          <h3 className="text-2xl font-semibold">Global Logs</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="filterBy"
                className="block text-sm font-medium text-gray-900"
              >
                Filter By
              </label>
              <select
                id="filterBy"
                name="filterBy"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Factories">Factory</option>
                <option value="Machine Classes">Machine Class</option>
                <option value="Machines">Machine</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-900"
              >
                {filterBy}
              </label>
              {filterInputs()}
            </div>
          </div>
        </div>
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
        {!isPaginatedLoading &&
        paginated?.items &&
        paginated?.items.length > 0 ? (
          <table className="w-full divide-y divide-gray-300 border-t border-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`text-sm py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-8 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    ID
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Date
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Product
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Operator
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Status
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Time
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Stop Reason
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginated?.items &&
                paginated?.items.map((item, idx) => (
                  <tr key={idx} className={`${!item.jobId ? "bg-red-50" : ""}`}>
                    <td
                      className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-8 ${
                        item.jobId ? "text-gray-900" : "text-red-500"
                      }`}
                    >
                      {item.globalCycle ? item.globalCycle : ""}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm text-gray-500 flex flex-col ${
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
                      className={`px-3 py-4 text-sm text-gray-500 ${
                        item.jobId ? "text-gray-900" : "text-red-500"
                      }`}
                    >
                      {typeof item.partId === "object" ? item.partId.name : ""}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm text-gray-500 ${
                        item.jobId ? "text-gray-900" : "text-red-500"
                      }`}
                    >
                      {typeof item.operator === "object"
                        ? item.operator?.firstName
                        : ""}{" "}
                      {typeof item.operator === "object"
                        ? item.operator?.lastName
                        : ""}
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
                          {item.time.toFixed(2)}s
                        </span>
                      ) : (
                        <span className="font-bold text-red-500">
                          {item.time.toFixed(2)}s
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
                  </tr>
                ))}
            </tbody>
          </table>
        ) : null}
        {!isPaginatedLoading &&
        paginated?.items &&
        paginated?.items.length === 0 ? (
          <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
            <div className="text-gray-500 text-lg font-semibold">
              No logs found
            </div>
          </div>
        ) : null}
        <div className="border-t border-gray-300">
          <div className="flex w-full h-20 items-center justify-between px-4 py-3 sm:px-6">
            <div className="h-10 z-[-1] sm:hidden">
              <a
                href="#"
                className="absolute left-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="absolute right-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="h-12 flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {paginated?.items?.length as number}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {paginated?.itemCount as number}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                {isPaginatedLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-8 w-36 bg-slate-200 rounded"></div>
                  </div>
                ) : (
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1 || numberOfPages === 0}
                      className="relative disabled:opacity-70 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold bg-blue-950 text-white ring-1 ring-inset ring-blue-900 hover:bg-blue-950 focus:z-20 focus:outline-offset-0">
                      {page}
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      disabled={page === numberOfPages || numberOfPages === 0}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogsTable
