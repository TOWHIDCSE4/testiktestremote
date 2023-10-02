import React, { Fragment, useEffect, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid"
import { T_Job, T_JobStatus } from "custom-validator"
import usePaginatedJobs from "../../../../hooks/jobs/usePaginatedJobs"
import dayjs from "dayjs"
import EditModal from "./modals/EditModal"
import DeleteModal from "./modals/DeleteModal"
import useProfile from "../../../../hooks/users/useProfile"
import Image from "next/image"
import combineClasses from "../../../../helpers/combineClasses"
import JobDetails from "./modals/JobDetails"
import { useCollapse } from "react-collapsed"
import TabTableDetail from "./TabTable-detail"

const TabTable = ({
  tab,
  locationId,
  jobSelection,
  searchInput,
}: {
  tab: T_JobStatus
  locationId: string
  jobSelection: any
  searchInput: string
}) => {
  const {
    data: jobs,
    isLoading: isJobsLoading,
    setLocationId,
    setStatus,
    setPage,
    setSearch,
    search,
    setJobType,
    jobType,
    page,
  } = usePaginatedJobs()

  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()

  const [editModal, setEditModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<T_Job[]>([])
  const [currentTab, setCurrentTab] = useState<T_JobStatus>("Pending")
  const [jobId, setJobId] = useState("")
  const [jobName, setJobName] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [locked, setLocked] = useState<boolean>(false)

  const toggleRowExpansion = (job: T_Job, selected: boolean) => {
    if (locked) {
      if (selected) return setSelectedJob([])
      return setSelectedJob([job])
    } else {
      if (selected)
        return setSelectedJob((prev) => prev.filter((i) => i._id !== job._id))
      // return setSelectedJob([job])
      return setSelectedJob((prev) => [...prev, job])
    }
  }
  const toggleLock = () => {
    setLocked(locked ? false : true)
  }

  useEffect(() => {
    setSelectedJob([])
  }, [locked])

  useEffect(() => {
    if (tab) {
      setStatus(tab)
      setSearch(searchInput)
      setJobType(jobSelection)
    }
    if (locationId) {
      setLocationId(locationId)
    }
  }, [tab, locationId, searchInput, jobSelection])

  const numberOfPages = Math.ceil((jobs?.itemCount as number) / 5)

  return (
    <>
      {isJobsLoading ? (
        <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full my-1 mx-2"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : !jobs?.error && jobs?.itemCount && jobs?.itemCount > 0 ? (
        <table className="w-full divide-y divide-gray-300 table-fixed">
          <thead>
            <tr>
              <th scope="col" className="w-4"></th>
              <th
                scope="col"
                className="py-3.5 pl-5 md:pl-7 lg:pl-9 text-left text-sm font-semibold text-gray-900 w-20 uppercase"
              >
                User
              </th>
              <th
                scope="col"
                className="py-3.5 text-left text-sm font-semibold text-gray-900 uppercase pl-4 w-28"
              >
                <a href="#" className="group inline-flex">
                  Factory
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-24 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Name
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Part
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-20 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Drawing
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-20 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Count
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-20 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Priority
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-24 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Due
                </a>
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 w-16"
              >
                {locked ? (
                  <LockClosedIcon
                    className="w-[1.5rxxem] h-[1.5rem]"
                    onClick={() => toggleLock()}
                  />
                ) : (
                  <LockOpenIcon
                    className="w-[1.5rem] h-[1.5rem]"
                    onClick={() => toggleLock()}
                  />
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {jobs?.items?.map((job: T_Job, index) => {
              const selected = selectedJob.some((i) => i._id === job._id)
              return (
                <Fragment key={index}>
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setJobId(job._id as string)
                      setJobName(job.name as string)
                      toggleRowExpansion(job, selected)
                    }}
                  >
                    <td className="m-0 pl-3 w-1/5 mt-4 pt-12">
                      {selected ? (
                        <ChevronDownIcon className="w-4 h-4 stroke-2 stroke-blue-950" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 stroke-2 stroke-blue-950" />
                      )}
                    </td>
                    <td className="py-3 pl-4 text-sm sm:pl-6 lg:pl-8">
                      <div className="relative h-11 w-11 bg-slate-200 rounded-full flex items-center justify-center">
                        {typeof job?.user === "object" &&
                        job?.user?.profile?.photo ? (
                          <Image
                            className="rounded-full"
                            src={`/files/${job?.user?.profile?.photo}`}
                            alt="Profile image"
                            fill
                          />
                        ) : typeof job?.user === "object" &&
                          !job?.user?.profile?.photo ? (
                          <Image
                            className="rounded-full"
                            src={`https://ui-avatars.com/api/?name=${job?.user?.firstName}+${job?.user?.lastName}`}
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
                    <td className="py-3 text-sm text-gray-800 pl-4">
                      {typeof job?.factory === "object"
                        ? job?.factory?.name
                        : ""}
                    </td>
                    <td className="py-3 pl-6 text-sm text-gray-800">
                      {job?.name}
                    </td>
                    <td className="py-3 pl-6 text-sm text-gray-800">
                      {job?.part?.name}
                    </td>
                    <td className="py-3 pl-6 text-sm text-gray-800">
                      {job?.drawingNumber}
                    </td>
                    <td className="py-3 pl-6 text-sm text-gray-800">
                      <div className="flex items-center">
                        {job?.count ? (
                          <>
                            {job.timerLogs ? job.timerLogs.length : 0}/
                            {job?.count}
                          </>
                        ) : (
                          <span className="text-2xl">∞</span>
                        )}{" "}
                        <br />
                      </div>
                    </td>
                    <td className="py-3 pl-6 text-sm text-gray-800">
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
                    <td className="py-3 pl-6 text-sm text-gray-800">
                      {job?.dueDate ? (
                        dayjs(job?.dueDate).format("DD/MM/YYYY")
                      ) : (
                        <span className="text-2xl">∞</span>
                      )}{" "}
                      <br />
                      <span className="text-red-500 hidden">Overdue</span>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <Menu as="div">
                        <Menu.Button onClick={(e) => e.stopPropagation()}>
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
                          <Menu.Items
                            className="absolute right-9 z-50 -mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            style={{ overflow: "visible" }}
                          >
                            <div className="">
                              <Menu.Item>
                                {({ active }) => (
                                  <span
                                    className={combineClasses(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm cursor-pointer text-left"
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setJobId(job._id as string)
                                    }}
                                  >
                                    Details
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
                                    onClick={(e) => {
                                      e.stopPropagation()
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
                                    onClick={(e) => {
                                      e.stopPropagation()
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

                  <tr>
                    <td colSpan={10}>
                      <TabTableDetail job={job} selected={selected} />
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      ) : (
        // no item
        <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
          <div className="text-gray-500 text-lg font-semibold">
            No {tab.toLocaleLowerCase()} job found
          </div>
        </div>
      )}
      <div className="inset-x-0">
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
                  {jobs?.items?.length as number}
                </span>{" "}
                of{" "}
                <span className="font-medium">{jobs?.itemCount as number}</span>{" "}
                results
              </p>
            </div>
            <div>
              {isJobsLoading ? (
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
