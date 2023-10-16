"use client"
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { Fragment, useEffect, useState } from "react"
import {
  T_BackendResponse,
  T_Factory,
  T_Locations,
  T_UserRole,
} from "custom-validator"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid"
import usePaginatedUsers from "../../../hooks/users/useGetPaginatedUsers"
import useLocations from "../../../hooks/locations/useLocations"
import { USER_ROLES, USER_STATUSES } from "../../../helpers/constants"
import { T_User, T_UserStatus } from "custom-validator/ZUser"
import { Menu, Transition } from "@headlessui/react"
import combineClasses from "../../../helpers/combineClasses"
import useFactories from "../../../hooks/factories/useFactories"
import useUpdateUser from "../../../hooks/users/useUpdateUser"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import ConfirmationModal from "./modals/ConfirmationModal"
import { DownOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Dropdown, Space } from "antd"
import DeleteModal from "./modals/DeleteModal"
import useProfile from "../../../hooks/users/useProfile"
import useStoreSession from "../../../store/useStoreSession"
import React from "react"

const ARR_USER_STATUSES = [
  USER_STATUSES.Requested,
  USER_STATUSES.Approved,
  USER_STATUSES.Archived,
  USER_STATUSES.Blocked,
  USER_STATUSES.Rejected,
]

type MenuItem = string

const Content = () => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const queryClient = useQueryClient()
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState<T_User | null>(null)
  const [action, setAction] = useState<T_UserStatus | null>(null)
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { mutate, isLoading: isUpdateUserLoading } = useUpdateUser()
  const { data: userProfile } = useProfile()
  const [checkedProduction, setCheckedProduction] = useState<{ id: string }[]>(
    []
  )
  const storeSession = useStoreSession(
    (
      state: {
        role:
          | "Administrator"
          | "Corporate"
          | "Production"
          | "Personnel"
          | "HR"
          | "Accounting"
          | "Sales"
          | "Super"
        email: string
        token: string | null
      } & {
        update: (session: {
          role:
            | "Administrator"
            | "Corporate"
            | "Production"
            | "Personnel"
            | "HR"
            | "Accounting"
            | "Sales"
            | "Super"
          email: string
          token: string | null
        }) => void
        reset: () => void
      }
    ) => state
  )
  const [filterBy, setFilterBy] = useState("Role")
  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    page,
    setPage,
    setRole,
    setLocationId,
    setStatus,
    setName,
  } = usePaginatedUsers()
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    if (openAccordion === id) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(id)
    }
  }

  const handleChangeCheck = (e: any, id: string) => {
    e.stopPropagation()
    setCheckedProduction((prevState) =>
      prevState.some((item) => item.id === id)
        ? prevState.filter((item) => item.id !== id)
        : [...prevState, { id }]
    )
  }

  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 5)
  const ARR_USER_ROLES = [
    ...(storeSession?.role === "Super" ? [USER_ROLES.Administrator] : []),
    USER_ROLES.Production,
    USER_ROLES.Personnel,
    USER_ROLES.Corporate,
    ...(storeSession?.role === "Super" || storeSession?.role === "Administrator"
      ? [USER_ROLES.HR]
      : []),
    USER_ROLES.Accounting,
    USER_ROLES.Sales,
  ]
  const filterInputs = () => {
    if (filterBy === "Location") {
      return (
        <select
          id="locations"
          name="locations"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setLocationId(e.target.value)
            setRole(null)
            setStatus(null)
          }}
          disabled={isLocationsLoading || isPaginatedLoading}
        >
          <option value="">Select Location</option>
          {locations?.items?.map((item: T_Locations, index: number) => {
            return (
              <option key={index} value={item._id as string}>
                {item.name}
              </option>
            )
          })}
        </select>
      )
    } else if (filterBy === "Role") {
      return (
        <select
          id="roles"
          name="roles"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setRole(e.target.value as T_UserRole)
            setStatus(null)
            if (storeSession?.role !== "Super" || "Adminstrator") {
              setLocationId(userProfile?.item?.locationId as string)
            } else {
              setLocationId("")
            }
          }}
        >
          {ARR_USER_ROLES.map((item: string, index: number) => {
            return <option key={index}>{item}</option>
          })}
        </select>
      )
    } else if (filterBy === "Status") {
      return (
        <select
          id="statuses"
          name="statuses"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setRole(null)
            setStatus(e.target.value as T_UserStatus)
            debugger
            if (storeSession?.role !== "Super" || "Administrator") {
              setLocationId(userProfile?.item?.locationId as string)
            } else {
              setLocationId("")
            }
            debugger
          }}
        >
          <option value="">Select Status</option>
          {ARR_USER_STATUSES.map((item: string, index: number) => {
            return <option key={index}>{item}</option>
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

  const isChecked = (id: string) => {
    return checkedProduction.filter((item) => item.id === id).length > 0
  }

  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["paginated-users"],
        })
        toast.success("User has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  useEffect(() => {
    if (storeSession?.role === "Super" || "Administrator") {
      setLocationId("")
    } else {
      setLocationId(userProfile?.item?.locationId as string)
    }
  }, [userProfile])

  const handleSelectAllProduction = (event: any) => {
    const data = paginated?.items ?? []
    let updatedArray = [] as any
    updatedArray =
      data?.length > 0 && event.target.checked
        ? data
            ?.filter((item) => item?._id !== undefined)
            .map((item) => ({ id: item?._id }))
        : []
    setCheckedProduction(updatedArray)
  }

  const items: MenuProps["items"] = [
    {
      label: "Admin",
      key: "0",
    },
    {
      label: "HR",
      key: "1",
    },
    {
      label: "Production",
      key: "2",
    },
    {
      label: "Corporate",
      key: "3",
    },
    {
      label: "Personnel",
      key: "4",
    },
    {
      label: "Dev",
      key: "5",
    },
  ]

  return (
    <>
      <div
        className={`relative w-full mt-6 overflow-hidden bg-white drop-shadow-lg rounded-md ${
          paginated ? "overflow-hidden" : "overflow-x-auto"
        }`}
      >
        <div className="px-1 w-full pt-2">
          <div className="flex">
            <div className="flex w-56 sm:flex-none cursor-pointer h-6">
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <DownOutlined />
                  <Space className="pl-2 text-[#7F1D1D]">TEAM LISTING</Space>
                </a>
              </Dropdown>

              <span className="text-lg font-bold flex pl-1">
                -<p className="pl-1 text-[#172554]">ADMIN</p>
              </span>
            </div>
            <div className="flex px-2 pb-8">
              <div className="flex">
                <div className="pl-0 space-y-2">
                  <div className="flex justify-start text-gray-900 ml-14">
                    <span className="text-[#7F1D1D]">City:</span>
                    <div className="border-b-[3px] border-[#172554] w-60 text-center">
                      <span>Seguin, Conroe, Gunter</span>
                    </div>
                  </div>
                  <div className="flex text-gray-900 ml-8">
                    <span className="text-[#7F1D1D]">Factory:</span>
                    <div className="border-b-[3px] border-[#172554] w-60 text-center">
                      <span>All</span>
                    </div>
                  </div>
                  <div className="flex text-gray-900">
                    <span className="text-[#7F1D1D]">Department:</span>
                    <div className="border-b-[3px] border-[#172554] w-60 text-center">
                      <span>All</span>
                    </div>
                  </div>
                </div>

                <div className="ml-12 space-y-5">
                  <div className="flex justify-end text-end text-gray-900 ml-14">
                    <span className="text-gray-500">
                      Add New
                      <br /> Team Member
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-8 ml-2 mt-2 text-white bg-[#172554] h-8 rounded-md"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end text-gray-900 ml-8">
                    <span className="py-1.5 px-5 border-1 bg-[#7F1D1D] border-black rounded-lg text-white">
                      Create Team List
                    </span>
                  </div>
                </div>
                {/* <div className="flex flex-col whitespace-nowrap justify-between">
              <div className="w-full flex justify-center items-center"></div>
            </div>
            <div className="flex flex-col whitespace-nowrap justify-between">
              <div className="w-full flex justify-center items-center"></div>
            </div>
            <div>
              
            </div>

            <div className="hidden">
              <label
                htmlFor="filterBy"
                className="block text-sm font-medium text-gray-900"
              >
                Team Listing
              </label>
              <select
                id="filterBy"
                name="filterBy"
                className="mt-2 block w-full rounded-md border-0 py-1 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option>All</option>
                <option>Status</option>
                {userProfile?.item.role === "Super" && (
                  <option>Location</option>
                )}
                <option className="flex">Team Listing</option>
              </select>
            </div>
            <div className="flex">
            {filterInputs()}
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-900"
              >
                Team Listing
              </label>
              
            </div> */}
              </div>
            </div>
          </div>
          {isPaginatedLoading ? (
            <div className="flex items-center justify-center mb-4 mt-9 w-full h-96">
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
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
              <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                <tr>
                  <th scope="col" className="w-[10%] text-slate-900">
                    <div className="flex items-center justify-center">
                      {/* <a href="#" className="group inline-flex items-center"> */}
                      User
                      <button
                        onClick={
                          (e) => {}
                          // handleInputChange(e, "createdAt")
                        }
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
                    {/* <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                                      </a> */}
                  </th>
                  <th>
                    <div className="flex items-center justify-center">
                      {/* <a href="#" className="group inline-flex items-center"> */}
                      City
                      <button
                        onClick={
                          (e) => {}
                          // handleInputChange(e, "createdAt")
                        }
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
                  {/* <th
                  scope="col"
                  className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Location
                    <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th> */}
                  <th>
                    <div className="flex items-center justify-center">
                      {/* <a href="#" className="group inline-flex items-center"> */}
                      Factory
                      <button
                        onClick={
                          (e) => {}
                          // handleInputChange(e, "createdAt")
                        }
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
                    {/* <span className="ml-2 flex-none rounded text-gray-400">
    <ChevronUpDownIcon
      className="h-5 w-5"
      aria-hidden="true"
    />
  </span>
                    </a> */}
                  </th>

                  <th>
                    <div className="flex items-center justify-center">
                      {/* <a href="#" className="group inline-flex items-center"> */}
                      Department
                      <button
                        onClick={
                          (e) => {}
                          // handleInputChange(e, "createdAt")
                        }
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

                    {/* <span className="ml-2 flex-none rounded text-gray-400">
    <ChevronUpDownIcon
      className="h-5 w-5"
      aria-hidden="true"
    />
  </span>
                    </a> */}
                  </th>

                  <th colSpan={2}>
                    <div className="flex items-center justify-center">
                      <div className="relative mb-3" data-te-input-wrapper-init>
                        <input
                          type="search"
                          className="peer block bg-slate-100 uppercase ring-1 focus:ring-1 focus:ring-[#172554] ring-gray-400 min-h-[auto] placeholder:text-gray-300 text-black w-40 ml-20 rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:peer-focus:text-primary "
                          id="exampleSearch2"
                          placeholder="Search User"
                        />
                      </div>
                    </div>
                  </th>
                  {/* <th
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
                </th> */}
                  {/* <th
                  scope="col"
                  className={`text-sm px-3 pl-3.5 pr-6 text-left  font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Actions
                  </a>
                </th> */}
                </tr>
              </thead>
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
                    const checked = isChecked(item._id ?? "")
                    return (
                      <React.Fragment key={item._id}>
                        <tr
                          key={idx}
                          className={`bg-gray text-slate-900 font-medium border-b ${rowClass} ${
                            isAccordionOpen ? "open" : ""
                          } ${!item._id ? "bg-red-50" : ""}`}
                          data-accordion-target={`#accordion-arrow-icon-body-${idx}`}
                          aria-expanded={isAccordionOpen}
                          aria-controls={`accordion-arrow-icon-body-${idx}`}
                          aria-colspan={6}
                          onClick={() =>
                            toggleAccordion(`accordion-arrow-icon-body-${idx}`)
                          }
                        >
                          <td className="pr-6">
                            <div className="flex items-center">
                              {isAccordionOpen ? (
                                <ChevronDownIcon className="w-4 ml-2 mr-4 h-4 stroke-1 stroke-gray-100 bg-gray-100" />
                              ) : (
                                <ChevronRightIcon className="w-4 ml-2 mr-4 h-4 stroke-2 stroke-blue-950" />
                              )}
                              <input
                                id={`checkbox-table-search-${idx}`}
                                type="checkbox"
                                className="w-4 h-4 bg-gray-100 text-gray-600  border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                                onClick={(e) =>
                                  handleChangeCheck(e, item?._id ?? "")
                                }
                                checked={checked}
                              />
                              <label
                                htmlFor={`checkbox-table-search-${idx}`}
                                className="sr-only"
                              >
                                {item.status}
                              </label>
                            </div>
                          </td>
                          <td className={`py-4 pl-4 pr-3 text-sm font-medium`}>
                            {item.firstName + item.lastName}
                          </td>
                          <td className={`px-3 py-4 text-sm text-gray-500`}>
                            <select
                              id="locations"
                              name="locations"
                              className="block w-28 rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-100 ring-opacity-0 bg-opacity-0 text-gray-900 focus:ring-opacity-0 ring-1 ring-inset ring-gray-100 focus:ring-1 focus:ring-gray-100 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                              onChange={(e) => {
                                mutate(
                                  {
                                    ...item,
                                    locationId: e.target.value,
                                  },
                                  callBackReq
                                )
                              }}
                              disabled={
                                isLocationsLoading ||
                                isUpdateUserLoading ||
                                isPaginatedLoading
                              }
                              value={
                                typeof item?.locationId === "object" &&
                                item?.locationId?._id
                                  ? item?.locationId?._id
                                  : ""
                              }
                            >
                              <option value="">Select Location</option>
                              {locations?.items?.map(
                                (item: T_Locations, index: number) => {
                                  return (
                                    <option
                                      key={index}
                                      value={item._id as string}
                                    >
                                      {item.name}
                                    </option>
                                  )
                                }
                              )}
                            </select>
                          </td>
                          <td className={`px-3 py-4 text-sm text-gray-500`}>
                            <select
                              id="factories"
                              name="factories"
                              className="block w-36 rounded-md bg-opacity-0 bg-gray-300 ring-opacity-0 border-0 py-1.5 pl-3 bg-gray pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                              onChange={(e) => {
                                if (e.target.value !== "Global") {
                                  mutate(
                                    {
                                      ...item,
                                      factoryId: e.target.value,
                                      isGlobalFactory: false,
                                      locationId:
                                        typeof item.locationId === "object"
                                          ? (item.locationId?._id as string)
                                          : "",
                                    },
                                    callBackReq
                                  )
                                } else {
                                  mutate(
                                    {
                                      ...item,
                                      factoryId: null,
                                      isGlobalFactory: true,
                                      role: USER_ROLES.Corporate as T_UserRole,
                                      locationId:
                                        typeof item.locationId === "object"
                                          ? (item.locationId?._id as string)
                                          : "",
                                    },
                                    callBackReq
                                  )
                                }
                              }}
                              disabled={
                                isFactoriesLoading ||
                                isUpdateUserLoading ||
                                isPaginatedLoading
                              }
                              value={
                                item.isGlobalFactory
                                  ? "Global"
                                  : typeof item?.factoryId === "object" &&
                                    item?.factoryId?._id
                                  ? item?.factoryId?._id
                                  : ""
                              }
                            >
                              <option value="">Select Factory</option>
                              {factories?.items?.map(
                                (item: T_Factory, index: number) => {
                                  return (
                                    <option
                                      key={index}
                                      value={item._id as string}
                                    >
                                      {item.name}
                                    </option>
                                  )
                                }
                              )}
                              <option>Global</option>
                            </select>
                          </td>
                          <td className={`px-3 py-4 text-sm text-gray-500`}>
                            <select
                              id="roles"
                              name="roles"
                              className="block w-36 rounded-md bg-gray-300 bg-opacity-0 ring-opacity-0 focus:ring-opacity-0 border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                              onChange={(e) => {
                                mutate(
                                  {
                                    ...item,
                                    role: e.target.value as T_UserRole,
                                    locationId:
                                      typeof item.locationId === "object"
                                        ? (item.locationId?._id as string)
                                        : "",
                                  },
                                  callBackReq
                                )
                              }}
                              value={item.role ? item.role : ""}
                              disabled={
                                isUpdateUserLoading || isPaginatedLoading
                              }
                            >
                              <option value="">Select Role</option>
                              {ARR_USER_ROLES.map(
                                (item: string, index: number) => {
                                  return <option key={index}>{item}</option>
                                }
                              )}
                            </select>
                          </td>
                          <td
                            className={`py-4  pl-0 text-end w-24 pr-3 text-sm font-medium ${
                              item.status === "Approved"
                                ? "text-green-600"
                                : item.status === "Requested"
                                ? "text-gray-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.status ? item.status : ""}
                          </td>
                          <td
                            className={`pl-24 py-4 text-sm text-gray-500 relative`}
                          >
                            <Menu as="div">
                              <Menu.Button>
                                <EllipsisVerticalIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-9 mt-1 w-24 z-10 origin-top-right -top-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    {item.status !== "Approved" && (
                                      <Menu.Item>
                                        {({ active }) => (
                                          <span
                                            className={combineClasses(
                                              active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700",
                                              "block px-4 py-2 text-sm cursor-pointer text-left"
                                            )}
                                            onClick={() => {
                                              setSelectedRow(item)
                                              setConfirmationModal(true)
                                              setAction(
                                                USER_STATUSES.Approved as T_UserStatus
                                              )
                                            }}
                                          >
                                            Approve
                                          </span>
                                        )}
                                      </Menu.Item>
                                    )}
                                    <Menu.Item>
                                      {({ active }) => (
                                        <span
                                          className={combineClasses(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "block px-4 py-2 text-sm cursor-pointer text-left"
                                          )}
                                          onClick={() => {
                                            setSelectedRow(item)
                                            setDeleteModal(true)
                                            setAction(
                                              USER_STATUSES.Rejected as T_UserStatus
                                            )
                                          }}
                                        >
                                          Reject
                                        </span>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <span
                                          className={combineClasses(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "block px-4 py-2 text-sm cursor-pointer text-left"
                                          )}
                                          onClick={() => {
                                            setSelectedRow(item)
                                            setDeleteModal(true)
                                            setAction(
                                              USER_STATUSES.Blocked as T_UserStatus
                                            )
                                          }}
                                        >
                                          Block
                                        </span>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <span
                                          className={combineClasses(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "block px-4 py-2 text-sm cursor-pointer text-left"
                                          )}
                                          onClick={() => {
                                            setSelectedRow(item)
                                            setDeleteModal(true)
                                            setAction(
                                              USER_STATUSES.Archived as T_UserStatus
                                            )
                                          }}
                                        >
                                          Delete
                                        </span>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </td>
                        </tr>
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
                                          item.email
                                            ? "text-gray-900"
                                            : "text-red-500"
                                        }`}
                                      >
                                        EMAIL:
                                      </p>
                                      <p
                                        className={`px-3 py-4 text-sm text-gray-500 ${
                                          item.email
                                            ? "text-gray-900"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {/* {typeof item. === "object"
                                            ? item.operator?.firstName
                                            : ""}{" "}
                                          {typeof item.operator === "object"
                                            ? item.operator?.lastName
                                            : ""} */}
                                        {item.email || "-"}
                                      </p>
                                    </span>
                                    <span className="flex w-[22rem] text-[13px] text-slate-900 ">
                                      <p
                                        className={`px-3 py-4 text-sm text-gray-500 font-semibold ${
                                          item.locationId
                                            ? "text-gray-900"
                                            : "text-red-500"
                                        }`}
                                      >
                                        CITY:
                                      </p>
                                      <p
                                        className={`px-3 py-4 text-sm text-gray-500 ${
                                          item.locationId
                                            ? "text-gray-900"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {typeof item?.locationId === "object" &&
                                        item?.locationId?._id
                                          ? item?.locationId?.name
                                          : ""}
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
          {!isPaginatedLoading &&
          paginated?.items &&
          paginated?.items.length === 0 ? (
            <div className="flex items-center justify-center mb-4 mt-9 w-full h-96">
              <div className="text-gray-500 text-lg font-semibold">
                No users found
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
                        <ChevronLeftIcon
                          className="h-5 w-5"
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
        <ConfirmationModal
          isOpen={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          user={selectedRow as T_User}
          status={action as T_UserStatus}
        />
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          user={selectedRow as T_User}
          status={action as T_UserStatus}
        />
      </div>
    </>
  )
}

export default Content
