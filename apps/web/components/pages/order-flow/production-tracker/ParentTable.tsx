import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import Image from "next/image"
import DeleteModal from "./modals/DeleteModal"
import EditModal from "./modals/EditModal"
import combineClasses from "../../../../helpers/combineClasses"
import TabTable from "./TabTable"
import { T_JobStatus } from "custom-validator"
import useCountStatus from "../../../../hooks/jobs/useCountStatus"
import usePartLocationCount from "../../../../hooks/parts/useGetPartLocationCount"

const ParentTable = ({ locationId }: { locationId: string }) => {
  const [currentTab, setCurrentTab] = useState<T_JobStatus>("Pending")
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const { data, isLoading, setJobStatuses, setJobLocation } = useCountStatus()

  const tabs = [
    { name: "Pending", count: 0, current: currentTab === "Pending" },
    { name: "Active", count: 2, current: currentTab === "Active" },
    { name: "Testing", count: 1, current: currentTab === "Testing" },
    { name: "Archived", count: 0, current: currentTab === "Archived" },
    { name: "Deleted", count: 0, current: currentTab === "Deleted" },
  ]

  useEffect(() => {
    if (locationId) {
      setJobLocation(locationId)
    }
    setJobStatuses(tabs.map((tab) => tab.name) as string[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId])

  const jobStatusCount = data
    ? data?.map((jobCount) => {
        if (!jobCount.error) {
          return jobCount.item
        }
      })
    : []

  return (
    <>
      <div
        className={`drop-shadow-lg border border-gray-200 bg-white rounded-md mt-7`}
      >
        <div>
          <div>
            {/* Tabs */}
            <div
              className={`flex items-center px-4 md:px-0 mt-4 pb-4 md:pb-0 md:mt-0 shadow`}
            >
              <div className="w-full">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                    defaultValue={
                      // @ts-expect-error
                      tabs.find((tab) => tab.current).name
                    }
                    onChange={(e) => {
                      setCurrentTab(e.currentTarget.value as T_JobStatus)
                    }}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name} value={tab.name}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav
                    className="isolate flex divide-x divide-gray-200"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, tabIdx) => (
                      <button
                        key={tab.name}
                        className={combineClasses(
                          tab.current
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                        onClick={() => setCurrentTab(tab.name as T_JobStatus)}
                      >
                        <span>
                          {isLoading
                            ? "Loading..."
                            : `${tab.name} (${jobStatusCount[tabIdx]})`}
                        </span>
                        <span
                          aria-hidden="true"
                          className={combineClasses(
                            tab.current ? "bg-blue-950" : "bg-transparent",
                            "absolute inset-x-0 bottom-0 h-1"
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto h-[30rem] relative">
              <TabTable tab={currentTab} locationId={locationId} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentTable
