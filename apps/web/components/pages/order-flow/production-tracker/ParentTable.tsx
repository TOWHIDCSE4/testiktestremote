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
  const [selectedValue, setSelectedValue] = useState<string>("client")
  const [inputValue, setInputValue] = useState<string>("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [clickRender, setClickRender] = useState(false)

  const { data, isLoading, setJobStatuses, setJobLocation } = useCountStatus()

  const tabs = [
    { name: "Pending", count: 0, current: currentTab === "Pending" },
    { name: "Active", count: 2, current: currentTab === "Active" },
    { name: "Testing", count: 1, current: currentTab === "Testing" },
    { name: "Archived", count: 0, current: currentTab === "Archived" },
    { name: "Deleted", count: 0, current: currentTab === "Deleted" },
  ]

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.currentTarget.value
    setSelectedValue(selectedOption)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
  }
  const pageFuncRender = () => {
    setClickRender(!clickRender)
  }

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
                            ? "bg-blue-950 text-slate-50 hover:bg-blue-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-bold focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                        onClick={() => {
                          pageFuncRender()
                          setCurrentTab(tab.name as T_JobStatus)
                        }}
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
                            "inset-x-0"
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div
              className={`flex justify-between items-center px-4 md:px-0 mt-2 pb-2 m md:mt-0 shadow`}
            >
              {currentTab === "Active" ? (
                <div className="md:flex items-center mt-2 w-[18rem]">
                  <label
                    htmlFor="JobSelector"
                    className="uppercase font-semibold text-lg text-gray-800 md:w-[70%] text-right mr-3"
                  >
                    JOB SELECTOR
                  </label>
                  <select
                    className={`block mt-2  bg-white dark:bg-gray-300 font-semibold md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                    onChange={handleDropdownChange}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="STOCK">STOCK</option>
                  </select>
                </div>
              ) : (
                <div></div>
              )}
              <div></div>
              <div className={`mt-2 mr-5`}>
                <div className="flex">
                  <button className="px-3 py-1 rounded-md  text-gray-800 font-semibold text-lg">
                    SEARCH
                  </button>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                    <input
                      id="search"
                      name="search"
                      className={`block w-56 rounded-md border-0 bg-white dark:bg-gray-300  py-1.5  pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6`}
                      placeholder="TYPE HERE"
                      type="search"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto relative">
              <TabTable
                pageRender={clickRender}
                tab={currentTab}
                locationId={locationId}
                searchInput={inputValue}
                jobSelection={currentTab === "Active" ? selectedValue : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentTable
