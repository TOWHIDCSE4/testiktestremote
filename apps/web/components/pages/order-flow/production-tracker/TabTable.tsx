import React, { Fragment, useEffect, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid"
import { T_Job, T_JobStatus } from "custom-validator"
import usePaginatedJobs from "../../../../hooks/jobs/usePaginatedJobs"
import dayjs from "dayjs"
import EditModal from "./modals/EditModal"
import DeleteModal from "./modals/DeleteModal"
import useProfile from "../../../../hooks/users/useProfile"
import Image from "next/image"
import combineClasses from "../../../../helpers/combineClasses"

const TabTable = ({
  tab,
  locationId,
}: {
  tab: T_JobStatus
  locationId: string
}) => {
  const {
    data: jobs,
    isLoading: isJobsLoading,
    setLocationId,
    setStatus,
    setPage,
    page,
  } = usePaginatedJobs()

  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()

  const [editModal, setEditModal] = useState(false)
  const [currentTab, setCurrentTab] = useState<T_JobStatus>("Pending")
  const [jobId, setJobId] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    if (tab) {
      setStatus(tab)
    }
    if (locationId) {
      setLocationId(locationId)
    }
  }, [tab, locationId])

  const numberOfPages = Math.ceil((jobs?.itemCount as number) / 10)

  return (
    <>
      {isJobsLoading ? (
        <div className="flex items-center justify-center mb-4 mt-9">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full my-1 mx-2"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : !jobs?.error && jobs?.itemCount && jobs?.itemCount > 0 ? (
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-5 md:pl-7 lg:pl-9 text-left text-sm font-semibold text-gray-900 w-16 uppercase"
              >
                User
              </th>
              <th
                scope="col"
                className="py-3.5 text-left text-sm font-semibold text-gray-900 uppercase pl-4"
              >
                <a href="#" className="group inline-flex">
                  Factory
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Name
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Part
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Drawing
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Count
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Priority
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Due
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
          <tbody className="bg-white">
            {jobs?.items?.map((job: T_Job, index) => {
              return (
                <tr className="border-b border-gray-200" key={index}>
                  <td className="py-4 pl-4 text-sm sm:pl-6 lg:pl-8">
                    <div className="relative h-11 w-11 bg-slate-200 rounded-full flex items-center justify-center">
                      {!isUserProfileLoading &&
                      userProfile?.item.profile?.photo ? (
                        <Image
                          className="rounded-full"
                          src={`/files/${userProfile?.item.profile?.photo}`}
                          alt="Profile image"
                          fill
                        />
                      ) : !isUserProfileLoading &&
                        !userProfile?.item.profile?.photo ? (
                        <Image
                          className="rounded-full"
                          src={`https://ui-avatars.com/api/?name=${userProfile?.item?.firstName}+${userProfile?.item?.lastName}`}
                          alt="Profile image"
                          fill
                        />
                      ) : (
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-11 w-11 rounded-full bg-slate-200"></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-800 pl-4">
                    {typeof job?.factoryId === "object"
                      ? job?.factoryId?.name
                      : ""}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {job?.name}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {/* @ts-ignore */}
                    {job?.partId?.name}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {job?.drawingNumber}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    <div className="flex items-center">
                      1 /{" "}
                      {job?.count ? (
                        job?.count
                      ) : (
                        <span className="text-2xl">∞</span>
                      )}{" "}
                      <br />
                    </div>
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {/* <ChartBarIcon
                      className={`h-5 w-5 ${
                        job?.priorityStatus === "High"
                          ? "text-red-500"
                          : job?.priorityStatus === "Medium"
                          ? "text-orange-500"
                          : job?.priorityStatus === "Low"
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    /> */}

                    <div className="flex bars mt-2">
                      <div
                        className={`h-3 rounded-t-full rounded-b-full w-1 first-bar ${
                          job?.priorityStatus === "High"
                            ? "bg-red-500"
                            : job?.priorityStatus === "Medium"
                            ? "bg-orange-500"
                            : job?.priorityStatus === "Low"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`h-4 rounded-t-full rounded-b-full w-1 second-bar ml-0.5 -translate-y-1 ${
                          job?.priorityStatus === "High"
                            ? "bg-red-500"
                            : job?.priorityStatus === "Medium"
                            ? "bg-orange-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`h-5 rounded-t-full rounded-b-full w-1 bg-gray-400 third-bar ml-0.5 -translate-y-2 ${
                          job?.priorityStatus === "High"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {job?.dueDate ? (
                      dayjs(job?.dueDate).format("DD/MM/YYYY")
                    ) : (
                      <span className="text-2xl">∞</span>
                    )}{" "}
                    <br />
                    <span className="text-red-500 hidden">Overdue</span>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
                        <Menu.Items className="absolute right-9 z-10 mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
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
                                    setEditModal(true)
                                    setJobId(job._id as string)
                                  }}
                                >
                                  Edit
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
                                    setDeleteModal(true)
                                    setJobId(job._id as string)
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
              )
            })}
          </tbody>
        </table>
      ) : (
        // no item
        <div className="flex items-center justify-center mb-4 mt-9">
          <div className="text-gray-500 text-lg font-semibold">
            No {tab.toLocaleLowerCase()} job found
          </div>
        </div>
      )}
      <div className="">
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
          <div className="hidden h-12 sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="absolute">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {jobs?.items?.length as number}
                </span>{" "}
                of{" "}
                <span className="font-medium">{jobs?.itemCount as number}</span>{" "}
                results
              </p>
            </div>
            <div className="absolute z-[-1] right-7">
              <div>
                {isJobsLoading ? (
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
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {numberOfPages
                      ? [...Array(numberOfPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setPage(index + 1)}
                            className={
                              page === index + 1
                                ? "relative z-10 inline-flex items-center bg-blue-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }
                          >
                            {index + 1}
                          </button>
                        ))
                      : null}
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

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        jobId={jobId}
      />
      <EditModal
        isOpen={editModal}
        jobId={jobId}
        currentTab={currentTab}
        onClose={() => {
          setEditModal(false)
        }}
      />
    </>
  )
}

export default TabTable
