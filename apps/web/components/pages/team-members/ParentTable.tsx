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
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
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
import DeleteModal from "./modals/DeleteModal"
import useProfile from "../../../hooks/users/useProfile"

const ARR_USER_STATUSES = [
  USER_STATUSES.Requested,
  USER_STATUSES.Approved,
  USER_STATUSES.Archived,
  USER_STATUSES.Blocked,
  USER_STATUSES.Rejected,
]

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
  const [filterBy, setFilterBy] = useState("All")
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
  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 5)
  const ARR_USER_ROLES = [
    ...(userProfile?.item.role === "Super" ? [USER_ROLES.Administrator] : []),
    USER_ROLES.Production,
    USER_ROLES.Personnel,
    USER_ROLES.Corporate,
    ...(userProfile?.item.role === "Super" ||
    userProfile?.item.role === "Administrator"
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
            if (userProfile?.item.role !== "Super") {
              setLocationId(userProfile?.item?.locationId as string)
            } else {
              setLocationId("")
            }
          }}
        >
          <option value="">Select Role</option>
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
            if (userProfile?.item.role !== "Super") {
              setLocationId(userProfile?.item?.locationId as string)
            } else {
              setLocationId("")
            }
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
    if (userProfile?.item.role !== "Super") {
      setLocationId(userProfile?.item?.locationId as string)
    } else {
      setLocationId("")
    }
  }, [userProfile])

  return (
    <>
      <div
        className={`relative w-full mt-6 overflow-hidden bg-white drop-shadow-lg rounded-md ${
          paginated ? "overflow-hidden" : "overflow-x-auto"
        }`}
      >
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
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
                <option>All</option>
                <option>Status</option>
                {userProfile?.item.role === "Super" && (
                  <option>Location</option>
                )}
                <option>Role</option>
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
            <div>
              <label
                htmlFor="filterBy"
                className="block text-sm font-medium text-gray-900"
              >
                Search Name
              </label>
              <input
                type="text"
                name="search"
                className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                onChange={(e) => {
                  setName(e.target.value)
                  if (userProfile?.item.role !== "Super") {
                    setLocationId(userProfile?.item?.locationId as string)
                  }
                }}
              />
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
          <table className="w-full divide-y divide-gray-300 border-t border-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`text-sm py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-8 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Name
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
                    Location
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
                    Factory
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
                    Role
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
                  className={`text-sm px-3 pl-3.5 pr-6 text-left  font-semibold text-gray-900 uppercase`}
                >
                  <a href="#" className="group inline-flex items-center">
                    Actions
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginated?.items &&
                paginated?.items.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-8`}
                    >
                      {item.firstName ? item.firstName : ""}{" "}
                      {item.lastName ? item.lastName : ""}
                    </td>
                    <td className={`px-3 py-4 text-sm text-gray-500`}>
                      <select
                        id="locations"
                        name="locations"
                        className="block w-28 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
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
                              <option key={index} value={item._id as string}>
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
                        className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
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
                              <option key={index} value={item._id as string}>
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
                        className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
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
                        disabled={isUpdateUserLoading || isPaginatedLoading}
                      >
                        <option value="">Select Role</option>
                        {ARR_USER_ROLES.map((item: string, index: number) => {
                          return <option key={index}>{item}</option>
                        })}
                      </select>
                    </td>
                    <td
                      className={`py-4 pl-4 pr-3 text-sm font-medium ${
                        item.status === "Approved"
                          ? "text-green-600"
                          : item.status === "Requested"
                          ? "text-gray-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status ? item.status : ""}
                    </td>
                    <td className={`pl-12 py-4 text-sm text-gray-500 relative`}>
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
                ))}
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
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
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
    </>
  )
}

export default Content
