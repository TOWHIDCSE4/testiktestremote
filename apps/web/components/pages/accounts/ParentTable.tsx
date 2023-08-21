import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import combineClasses from "../../../helpers/combineClasses"
import { T_BackendResponse, T_JobStatus, T_UserRole } from "custom-validator"
import TabTable from "./TabTable"
import useGetUserRoleCount from "../../../hooks/users/useGetUserRoleCount"
import { T_BACKEND_RESPONSE } from "../../../types/global"

const ParentTable = () => {
  const [currentTab, setCurrentTab] = useState<T_UserRole>("Personnel")
  // const [deleteModal, setDeleteModal] = useState(false)
  // const [editModal, setEditModal] = useState(false)
  const roles = ["Personnel", "Production", "Corporate", "Administrator"]
  const { data: userRoleCount, setRoles } = useGetUserRoleCount()
  useEffect(() => {
    setRoles(roles.map((role) => role) as string[])
  }, [setRoles])
  const tabs = userRoleCount?.map((role) => {
    return {
      name: role.item as string,
      count: role.itemCount as number,
      current: currentTab === role.item,
    }
  })

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
                      setCurrentTab(e.currentTarget.value as T_UserRole)
                    }}
                  >
                    {tabs?.map((tab) => (
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
                    {tabs?.map((tab, tabIdx) => (
                      <button
                        key={tab.name}
                        className={combineClasses(
                          tab.current
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs?.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                        onClick={() => setCurrentTab(tab.name as T_UserRole)}
                      >
                        <span>
                          {tab.name} ({tab.count})
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
            <div className="w-full flex flex-col-reverse overflow-x-auto">
              <div className="">
                <div className="flex w-full h-20 items-center justify-between px-4 py-3 sm:px-6">
                  <div className="h-10 sm:hidden">
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
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">10</span> of{" "}
                        <span className="font-medium">97</span> results
                      </p>
                    </div>
                    <div className="absolute z-0 right-7">
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </a>
                        {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                        <a
                          href="#"
                          aria-current="page"
                          className="relative inline-flex items-center bg-blue-950 px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 z-0"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 z-0"
                        >
                          2
                        </a>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 md:inline-flex z-0"
                        >
                          3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                          ...
                        </span>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 md:inline-flex z-0"
                        >
                          8
                        </a>

                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 z-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <TabTable tab={currentTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentTable
