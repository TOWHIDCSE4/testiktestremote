import React, { Fragment, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { T_Job, T_JobStatus } from "custom-validator"
import usePaginatedJobs from "../../../../hooks/jobs/usePaginatedJobs"
import dayjs from "dayjs"

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
  } = usePaginatedJobs()
  useEffect(() => {
    if (tab) {
      setStatus(tab)
    }
    if (locationId) {
      setLocationId(locationId)
    }
  }, [tab, locationId])

  console.log("jobs", jobs)

  return (
    <>
      {isJobsLoading ? (
        <div className="flex items-center justify-center my-4">
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
                  Machine
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Draw
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
                    <div className="h-11 w-11 bg-stone-500 rounded-full text-white flex items-center justify-center">
                      UA
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500 pl-5">
                    <div className="h-11 w-11 bg-blue-500 rounded-full uppercase text-white flex items-center justify-center">
                      Pipe
                    </div>
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {job?.name}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">
                    {/* @ts-ignore */}
                    {job?.partId?.name}
                  </td>
                  <td className="py-4 pl-6 text-sm text-gray-800">Empty</td>
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
                    {job?.priorityStatus} <br />
                    <span className="text-red-500 hidden">Overdue</span>
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
                  <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
                        <Menu.Items>
                          <div className="rounded-md border border-gray-300 absolute py-3 px-6 -translate-x-[78px] z-10 bg-white">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  className="text-left text-gray-800 cursor-pointer"
                                  // onClick={() => setEditModal(true)}
                                >
                                  Edit
                                </div>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  className="text-left text-gray-800 mt-2 cursor-pointer"
                                  // onClick={() => setDeleteModal(true)}
                                >
                                  Delete
                                </div>
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
        <div className="flex items-center justify-center my-4">
          <div className="text-gray-500 text-lg font-semibold">
            No {tab.toLocaleLowerCase()} job found
          </div>
        </div>
      )}
    </>
  )
}

export default TabTable
