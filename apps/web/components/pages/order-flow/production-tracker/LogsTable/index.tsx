"use client"
import { DatePicker, Space, Select } from "antd"
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import dayjs from "dayjs"

import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { usePathname } from "next/navigation"
import React, { Dispatch, useEffect, useState } from "react"
import useGlobalTimerLogs from "../../../../../hooks/timerLogs/useGlobalTimerLogs"
import useFactories from "../../../../../hooks/factories/useFactories"
import {
  T_Factory,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Locations,
} from "custom-validator"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClasses"
import useMachines from "../../../../../hooks/machines/useMachines"
import { set } from "mongoose"
import useGetMachinesByLocation from "../../../../../hooks/machines/useGetMachinesByLocation"
import useLocations from "../../../../../hooks/locations/useLocations"
import usePaginatedParts from "../../../../../hooks/parts/usePaginatedParts"

const { RangePicker } = DatePicker

const LogsTable = ({ locationId }: { locationId: string }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    if (openAccordion === id) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(id)
    }
  }

  const [sortType, setSortType] = useState<string>("")
  const [keyword, setKeyword] = useState<string>("")
  const [minWidth, setMinWidth] = useState<number>(window.innerWidth)
  const [batchAction, setBatchAction] = useState<string>("")
  const [city, setCity] = useState<string>("64d5814fb996589a945a6402")
  const [machineClass, setMachineClass] = useState<string>("")
  const [dateRange, setDateRange] = useState<string>("")
  const [partSelector, setPartSelector] = useState<string>("")
  const [machine, setMachine] = useState<string>("")
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    // Function to update the window width when the window is resized
    const handleResize = () => {
      setMinWidth(window.innerWidth)
    }

    // Add an event listener for the "resize" event
    window.addEventListener("resize", handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    const newValue = e.currentTarget.value
    setKeyword(key)
    setSortType(sortType === "asc" ? "dsc" : "asc")
  }

  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()
  const { data: machines, isLoading: isMachinesLoading } =
    useGetMachinesByLocation(locationId)
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const {
    data: allParts,
    isLoading: isGetAllPartsLoading,
    setLocationId,
    setPage: setPartsPage,
    page: partsPage,
    setName,
  } = usePaginatedParts()

  useEffect(() => {
    setLocationId(city)
    setPage(2)
  }, [city, setLocationId])

  useEffect(() => {
    setName(search)
  }, [search, setName])

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    setSearch(value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())

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
  } = useGlobalTimerLogs(locationId, sortType, keyword)
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
        <div className="px-1 py-4">
          <div className="flex pb-10">
            <div className=" whitespace-nowrap">
              <h3 className="text-2xl font-semibold pr-1">GLOBAL PRODUCTION</h3>
              <div className="w-full flex justify-center items-center">
                <select
                  id="filterBy"
                  name="filterBy"
                  className=" mt-2 w-20% block rounded-lg border-0 py-1 px-2 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="BatchAction">Batch action</option>
                  <option value="Factories">Factory</option>
                  <option value="Machine Classes">Machine Class</option>
                  <option value="Machines">Machine</option>
                </select>
              </div>
            </div>
            <div className=" grid grid-rows-2 grid-flow-col gap-1">
              <div className="flex mb-3">
                <div
                  className={`flex w-[10rem] ${
                    minWidth <= 1370 ? "ml-12" : "ml-10"
                  } text-[11px] items-center`}
                >
                  <p className="flex justify-start font-semibold">CITY</p>
                  <p className="w-[5rem] pl-4">
                    <select
                      id="filterBy"
                      name="filterBy"
                      className=" flex items-center w-[6.3rem] px-2 py-0 rounded-lg border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {/* <option value=""></option> */}
                      {locations?.items?.map(
                        (item: T_Locations, index: number) => {
                          return (
                            <option key={index} value={item._id as string}>
                              {item.name}
                            </option>
                          )
                        }
                      )}
                    </select>
                  </p>
                </div>
                <div className="flex text-[11px] items-center">
                  <p className="flex justify-end font-semibold ">
                    MACHINE CLASS
                  </p>
                  <p className=" pl-2">
                    <select
                      id="filterBy"
                      name="filterBy"
                      className="flex items-center px-1 py-0 rounded-lg border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                      onChange={(e) => setMachineClass(e.target.value)}
                    >
                      <option value=""></option>
                      {machineClasses?.items?.map(
                        (item: T_MachineClass, index: number) => {
                          return (
                            <option key={index} value={item._id as string}>
                              {item.name}
                            </option>
                          )
                        }
                      )}
                    </select>
                  </p>
                </div>
                <div className="flex text-[11px] items-center">
                  <p className="flex justify-start w-[3rem] ml-4 font-semibold">
                    MACHINE
                  </p>
                  <p className="w-3/1 pl-5">
                    <select
                      id="filterBy"
                      name="filterBy"
                      className="flex items-center px-1 py-0 w-[6.3rem] rounded-lg border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value=""></option>
                      {machines?.items?.map(
                        (item: T_Machine, index: number) => {
                          return (
                            <option key={index} value={item._id as string}>
                              {item.name}
                            </option>
                          )
                        }
                      )}
                    </select>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap mb-3">
                <div className="flex text-[11px] pl-0">
                  <p className="flex items-center justify-start font-semibold pl-1">
                    DATE RANGE
                  </p>
                  <div className="pl-2">
                    <Space
                      direction="vertical"
                      className=" flex items-center w-[12rem] rounded-lg "
                      size={12}
                    >
                      <RangePicker />
                    </Space>
                  </div>
                </div>
                <div className="flex text-[11px] items-center pl-2 ">
                  <p className="flex justify-end font-semibold items-center">
                    PART SELECTOR
                  </p>
                  <Select
                    // id="filterBy"
                    // name="filterBy
                    onSelect={(e) => setPartSelector(e.toString())}
                    showSearch
                    placeholder="Select a part"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    // filterOption={filterOption}
                    className="flex items-center w-[15rem] ml-2 py-0 rounded-lg border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                  >
                    {allParts?.items?.map((item: T_Part, index: number) => {
                      return (
                        <option key={index} value={item._id as string}>
                          {item.name}
                        </option>
                      )
                    })}
                  </Select>
                </div>
                <div className="flex items-center">
                  <div
                    className={`flex ${
                      minWidth >= 1370 ? "xl:w-[14.5rem] xl:pl-10 mt-4" : "pl-2"
                    } ${
                      minWidth <= 1295 ? "mt-4" : ""
                    } text-[10px] justify-end `}
                  >
                    <p className="flex justify-center w-4/3 p-1 border rounded-lg border-1 border-black bg-red-900 text-slate-50">
                      GENERATE REPORT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
            {!isPaginatedLoading &&
            paginated?.items &&
            paginated?.items.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      CYCLE
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        DATE
                        <button onClick={(e) => handleInputChange(e, "date")}>
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
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        MACHINE
                        <button
                          onClick={(e) => handleInputChange(e, "machine")}
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
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        PART
                        <button onClick={(e) => handleInputChange(e, "part")}>
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
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        ID
                        <button onClick={(e) => handleInputChange(e, "id")}>
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
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        STATUS
                        <button
                          onClick={(e) => handleInputChange(e, "machine")}
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
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center ">
                        TIME
                        <button
                          onClick={(e) => handleInputChange(e, "machine")}
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
                      </div>
                    </th>
                  </tr>
                </thead>
                {/* table body starts here */}
                <tbody
                  data-accordion="open"
                  className="border-t-4 border-indigo-900"
                >
                  {paginated?.items &&
                    paginated?.items.map((item, idx) => {
                      const rowClass =
                        idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                      const isAccordionOpen =
                        openAccordion === `accordion-arrow-icon-body-${idx}`
                      return (
                        <React.Fragment key={item._id}>
                          {/* {idx === 0 ? ( // Add accordion to the first row (index 0) */}
                          <tr
                            key={idx}
                            className={`bg-gray text-slate-900 font-medium border-b ${rowClass} ${
                              isAccordionOpen ? "open" : ""
                            } ${!item.jobId ? "bg-red-50" : ""}`}
                            data-accordion-target={`#accordion-arrow-icon-body-${idx}`}
                            aria-expanded={isAccordionOpen}
                            aria-controls={`accordion-arrow-icon-body-${idx}`}
                            onClick={() =>
                              toggleAccordion(
                                `accordion-arrow-icon-body-${idx}`
                              )
                            }
                          >
                            <td className="pr-6">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                  className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                                <input
                                  id={`checkbox-table-search-${idx}`}
                                  type="checkbox"
                                  className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${idx}`}
                                  className="sr-only"
                                >
                                  {item.cycle}
                                </label>
                              </div>
                            </td>
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              {dayjs
                                .tz(dayjs(item.createdAt), "America/Chicago")
                                .format("MM/DD/YYYY")}
                            </th>
                            <td className="px-6 py-4">
                              {/* @ts-expect-error */}
                              {item?.machineId.name}
                            </td>
                            <td
                              className={`px-6 py-4 text-sm text-gray-500 flex flex-col ${
                                item.jobId ? "text-gray-900" : "text-red-500"
                              }`}
                            >
                              {typeof item.partId === "object"
                                ? item.partId.name
                                : ""}
                            </td>
                            <td className="px-6 py-4">
                              {item.globalCycle ? item.globalCycle : ""}
                            </td>
                            <td className="px-6 py-4">
                              {item.status === "Gain" ? (
                                <span
                                  className={`font-bold ${
                                    item.jobId
                                      ? "text-green-500"
                                      : "text-red-500"
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
                            <td className="px-6 py-4">
                              {item.status === "Gain" ? (
                                <span
                                  className={`font-bold ${
                                    item.jobId
                                      ? "text-green-500"
                                      : "text-red-500"
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
                          </tr>
                          {/* ) : null} */}

                          {isAccordionOpen && (
                            <tr
                              id={`accordion-arrow-icon-body-${idx}`}
                              aria-labelledby={`accordion-arrow-icon-heading-${idx}`}
                              className={`${isAccordionOpen ? "open" : ""}`}
                            >
                              <td colSpan={7}>
                                <div className=" border border-b-0 border-gray-100 bg-gray-100  h-13">
                                  <div className="w-[73%]">
                                    <div className="flex justify-between">
                                      <span className="flex w-[27rem] text-[14px] text-slate-900 font-semibold border-r-4 border-gray-500 p-0 pb-8">
                                        <p className="w-2/3 text-right">
                                          ADDITIONAL INFO
                                        </p>
                                      </span>

                                      <span className="flex w-[22rem] text-[13px] ">
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 font-semibold ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          OPERATOR :
                                        </p>
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {typeof item.operator === "object"
                                            ? item.operator?.firstName
                                            : ""}{" "}
                                          {typeof item.operator === "object"
                                            ? item.operator?.lastName
                                            : ""}
                                        </p>
                                      </span>
                                      <span className="flex w-[22rem] text-[13px] text-slate-900 ">
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 font-semibold ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          STOP REASON :
                                        </p>
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {item.stopReason.join(", ")}
                                        </p>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                </tbody>
              </table>
            ) : null}
          </div>
          {/* <div className="grid grid-cols-2 gap-4 mt-4">
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
            </div> */}
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
        {/* {!isPaginatedLoading &&
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
          ) : null} */}
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
            <div className="h-12 flex items-center justify-between w-full">
              <div className="">
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
              <div className="h-12 text-end flex items-center ">
                <div className="">
                  <p className="text-sm text-gray-700">Global Total Units :</p>
                  <p className="text-sm text-gray-700">Global Total Tons :</p>
                  <p className="text-sm text-gray-700">
                    Global Units Per Hour :
                  </p>
                  <p className="text-sm text-gray-700">
                    Global Tons Per Hour :
                  </p>
                </div>
              </div>
              <button className="flex justify-center items-center p-2 text-lg">
                PAUSE
              </button>
              <div>
                {isPaginatedLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-8 w-36 mt-7 bg-slate-200 rounded"></div>
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
                      <ChevronLeftIcon
                        className={`h-5 w-5 ${
                          page > 1 && "stroke-1 stroke-blue-950"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      {page} / {numberOfPages ? numberOfPages : 1}
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      disabled={page === numberOfPages || numberOfPages === 0}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className={`h-5 w-5 ${
                          numberOfPages > 1 &&
                          page < numberOfPages &&
                          "stroke-1 stroke-blue-950"
                        }`}
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
